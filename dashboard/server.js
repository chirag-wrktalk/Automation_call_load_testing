const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

const PORT = 3001;

app.use(express.json());

// Debug logging - vital for proxy troubleshooting
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve from root. The proxy handles the /call-test prefix.
app.use(express.static(path.join(__dirname, 'public')));

let currentProcess = null;
let testStartTime = null;
let testDuration = null;
let metricsInterval = null;

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    if (currentProcess) {
        socket.emit('status', { 
            running: true, 
            startTime: testStartTime, 
            duration: testDuration 
        });
    }
});

// System metrics logic
function getCPUInfo() {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    cpus.forEach(cpu => {
        for (let type in cpu.times) total += cpu.times[type];
        idle += cpu.times.idle;
    });
    return { idle, total };
}

let lastCPU = getCPUInfo();
let lastNetBytes = 0;

async function getNetworkBytes() {
    try {
        const data = fs.readFileSync('/proc/net/dev', 'utf8');
        let rx = 0, tx = 0;
        data.split('\n').forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 10 && parts[0] !== 'Inter-' && parts[0] !== 'face') {
                rx += parseInt(parts[1]);
                tx += parseInt(parts[9]);
            }
        });
        return { rx, tx };
    } catch (e) { return { rx: 0, tx: 0 }; }
}

async function emitMetrics() {
    const currentCPU = getCPUInfo();
    const idleDiff = currentCPU.idle - lastCPU.idle;
    const totalDiff = currentCPU.total - lastCPU.total;
    const cpuUsage = totalDiff ? (100 - Math.round(100 * idleDiff / totalDiff)) : 0;
    lastCPU = currentCPU;

    const currentNet = await getNetworkBytes();
    const rxSpeed = lastNetBytes ? (currentNet.rx - lastNetBytes.rx) : 0;
    const txSpeed = lastNetBytes ? (currentNet.tx - lastNetBytes.tx) : 0;
    lastNetBytes = currentNet;

    const memTotal = os.totalmem();
    const memFree = os.freemem();
    const memUsed = memTotal - memFree;

    io.emit('metrics', {
        cpu: cpuUsage,
        mem: {
            used: memUsed,
            total: memTotal,
            percent: Math.round((memUsed / memTotal) * 100)
        },
        net: {
            rx: rxSpeed, // bytes per 2s
            tx: txSpeed
        },
        timestamp: Date.now()
    });
}

app.post('/start', (req, res) => {
    const { workers, duration, url } = req.body;
    
    if (currentProcess) {
        return res.status(400).json({ error: 'A test is already running' });
    }

    console.log(`Starting test: Workers=${workers}, Duration=${duration}, URL=${url}`);

    const env = { 
        ...process.env, 
        PARALLEL_RUNS: workers || 5, 
        DURATION_MINS: duration || 10, 
        CALL_URLS: url 
    };

    testStartTime = Date.now();
    testDuration = duration;

    // Start metrics collection
    getNetworkBytes().then(b => lastNetBytes = b);
    metricsInterval = setInterval(emitMetrics, 2000);

    currentProcess = spawn('npm', ['run', 'test:call:parallel'], { 
        cwd: path.join(__dirname, '..'),
        env,
        detached: true 
    });

    // Notify all clients immediately that the test has started
    io.emit('status', { 
        running: true, 
        startTime: testStartTime, 
        duration: testDuration 
    });

    currentProcess.stdout.on('data', (data) => io.emit('log', data.toString()));
    currentProcess.stderr.on('data', (data) => io.emit('log', data.toString()));

    currentProcess.on('close', (code) => {
        io.emit('log', `\n[SYSTEM] Test process exited with code ${code}\n`);
        io.emit('status', { running: false });
        
        clearInterval(metricsInterval);
        metricsInterval = null;
        
        currentProcess = null;
        testStartTime = null;
        testDuration = null;
    });

    res.json({ status: 'started' });
});

app.post('/stop', (req, res) => {
    if (currentProcess) {
        console.log(`Force killing test process group: ${currentProcess.pid}`);
        try {
            // Negative PID kills the entire process group for 100% cleanup
            process.kill(-currentProcess.pid, 'SIGKILL');
            io.emit('log', `\n[SYSTEM] Test forcefully terminated by user.\n`);
        } catch (e) {
            console.error(`Kill failed: ${e.message}`);
            // Fallback to direct kill if group kill fails
            try { currentProcess.kill('SIGKILL'); } catch(e2) {}
        }
        res.json({ status: 'stopping' });
    } else {
        res.status(400).json({ error: 'No test is running' });
    }
});

server.listen(PORT, () => {
    console.log(`Dashboard server running on http://localhost:${PORT}`);
});

