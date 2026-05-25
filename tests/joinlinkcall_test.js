const fs = require('fs');
const path = require('path');
// const os = require('os');

/**
 * Global Configuration for Call Performance Testing
 */
const CONFIG = {
  // URLs will be parsed from process.env.CALL_URLS
  selectors: {
    nameInput: 'input[placeholder="Enter your name"]',
    joinButton: 'button[type="submit"]',
    endCallButton: 'button.bg-red-400',
    videoStream: 'video[autoplay][playsinline]',
    // showStatsBtn: 'button[aria-label="Show call debug stats"]',
    // statsModalTitle: '//h2[text()="Call debug stats"]',
    // copyAllBtn: '//button[contains(., "Copy all")]',
    micBtnOn: 'button[aria-label="Mic"][aria-checked="true"]',
    micBtnOff: 'button[aria-label="Mic"][aria-checked="false"]',
  },
  stats: {
    pollInterval: parseInt(process.env.POLL_INTERVAL || '10', 10),     // seconds between samples
    durationMins: parseInt(process.env.DURATION_MINS || '3', 10),     // total duration of the test in minutes
    // outputDir: path.join(__dirname, '..', 'stats'),
  }
};

/**
 * Helper Functions
 */

/**
 * Executes the UI interaction flow to enter a name and join the call.
 */
async function joinCall(I, callUrl, userName) {
  console.log(`[JoinFlow] Starting join process for ${userName} at ${callUrl}`);
  await I.usePlaywrightTo('grant media permissions', async ({ browserContext }) => {
    await browserContext.grantPermissions(['camera', 'microphone']);
  });

  await I.amOnPage(callUrl);
  console.log(`[JoinFlow] ${userName}: Navigation to page complete.`);

  // Mute before joining (Conditional on PREMUTE)
  if (process.env.PREMUTE === 'true') {
    try {
      await I.waitForElement(CONFIG.selectors.micBtnOn, 15);
      console.log(`[JoinFlow] ${userName}: PREMUTE is true. Mic is ON, clicking to mute...`);
      await I.click(CONFIG.selectors.micBtnOn);
      await I.waitForElement(CONFIG.selectors.micBtnOff, 10);
      console.log(`[JoinFlow] ${userName}: Mic is now OFF (Muted).`);
    } catch (err) {
      console.warn(`[JoinFlow] ${userName}: Failed to mute microphone or mic button not found. Proceeding...`);
    }
  }

  try {
    await I.waitForElement(CONFIG.selectors.nameInput, 20); 
    console.log(`[JoinFlow] ${userName}: Name input found.`);
  } catch (err) {
    console.warn(`[JoinFlow] ${userName}: [Retry] Target element ${CONFIG.selectors.nameInput} not found, refreshing page...`);
    await I.refreshPage();
    await I.waitForElement(CONFIG.selectors.nameInput, 20); 
    console.log(`[JoinFlow] ${userName}: Name input found after refresh.`);
  }

  await I.fillField(CONFIG.selectors.nameInput, userName);
  console.log(`[JoinFlow] ${userName}: Username "${userName}" entered.`);

  await I.waitForText('Join call', 15, CONFIG.selectors.joinButton); // Increased patience
  await I.click('Join call', CONFIG.selectors.joinButton);
  console.log(`[JoinFlow] ${userName}: Join button clicked.`);
}

/**
 * Checks if multiple video streams are visible and attempts to open the stats modal.
 */
// async function openStats(I, userName) {
//   const videoCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.videoStream);
//   if (videoCount > 2) {
//     console.warn(`[StatsFlow] ${userName}: In the call (${videoCount} videos), trying to open stats...`);
//     const statsBtnCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.showStatsBtn);
//
//     if (statsBtnCount > 0) {
//       await I.click(CONFIG.selectors.showStatsBtn);
//       console.warn(`[StatsFlow] ${userName}: Clicked stats button, waiting for modal...`);
//       await I.wait(3);
//
//       const modalCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.statsModalTitle);
//       if (modalCount > 0) {
//         console.warn(`[StatsFlow] ${userName}: Stats modal confirmed OPEN.`);
//         return true;
//       } else {
//         console.warn(`[StatsFlow] ${userName}: FAILED to confirm modal open (title not found).`);
//         return false;
//       }
//     } else {
//       console.warn(`[StatsFlow] ${userName}: FAILED to find stats button.`);
//       return false;
//     }
//   } else {
//     console.warn(`[StatsFlow] ${userName}: SKIP opening stats - insufficient videos (${videoCount}).`);
//     return false;
//   }
// }

/**
 * Prepares the file system for storing JSON statistics.
 */
// function setupStatsDirectory(userName, callLinkDisplayName) {
//   const runGroup = process.env.RUN_ID || new Date().toISOString().substring(0, 16).replace(/[:T]/g, '-');
//   const runPath = path.join(CONFIG.stats.outputDir, runGroup);
//   const sessionPath = path.join(runPath, callLinkDisplayName, userName);
//
//   if (!fs.existsSync(sessionPath)) {
//     fs.mkdirSync(sessionPath, { recursive: true });
//   }
//   return { sessionPath, runPath };
// }

/**
 * Captures host machine performance metrics.
 */
// function logSystemStats(runPath) {
//   const statsFile = path.join(runPath, 'system_performance.json');
//   const cpus = os.cpus();
//   const load = os.loadavg();
//   const totalMem = os.totalmem();
//   const freeMem = os.freemem();
//
//   const sample = {
//     timestamp: new Date().toISOString(),
//     cpu: { load1m: load[0].toFixed(2), load5m: load[1].toFixed(2), load15m: load[2].toFixed(2), cores: cpus.length },
//     memory: {
//       total: Math.round(totalMem / 1024 / 1024) + 'MB',
//       free: Math.round(freeMem / 1024 / 1024) + 'MB',
//       usage: Math.round(((totalMem - freeMem) / totalMem) * 100) + '%'
//     }
//   };
//
//   let allStats = [];
//   if (fs.existsSync(statsFile)) {
//     try {
//       allStats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
//     } catch (e) {}
//   }
//   allStats.push(sample);
//   fs.writeFileSync(statsFile, JSON.stringify(allStats, null, 2));
// }

/**
 * Captures WebRTC stats and saves them.
 */
// async function captureAndSaveStats(I, sessionPath, userName) {
//   const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//   console.warn(`[CaptureFlow] ${userName}: Starting iteration at ${timestamp}`);
//
//   try {
//     await I.executeScript(() => {
//       window.capturedWebRTCStats = null;
//       navigator.clipboard.writeText = async (text) => {
//         window.capturedWebRTCStats = text;
//         return true;
//       };
//     });
//
//     let copyBtnCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.copyAllBtn);
//
//     if (copyBtnCount === 0) {
//       console.warn(`[CaptureFlow] ${userName}: "Copy all" button NOT visible. Triggering RECOVERY...`);
//       const success = await openStats(I, userName);
//       if (success) {
//         console.warn(`[CaptureFlow] ${userName}: Recovery attempt reported SUCCESS. Re-checking button...`);
//       } else {
//         console.warn(`[CaptureFlow] ${userName}: Recovery attempt reported FAILURE.`);
//       }
//       copyBtnCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.copyAllBtn);
//     }
//
//     if (copyBtnCount > 0) {
//       console.warn(`[CaptureFlow] ${userName}: "Copy all" button is visible. Clicking...`);
//       try {
//         await I.click(CONFIG.selectors.copyAllBtn);
//         const statsText = await I.executeScript(() => window.capturedWebRTCStats);
//
//         if (statsText) {
//           console.warn(`[CaptureFlow] ${userName}: Stats successfully captured from clipboard.`);
//           const filename = `${userName}_${timestamp}.json`;
//           fs.writeFileSync(path.join(sessionPath, filename), statsText);
//           return;
//         } else {
//           console.warn(`[CaptureFlow] ${userName}: FAILED to capture stats from clipboard after click.`);
//         }
//       } catch (clickErr) {
//         console.warn(`[CaptureFlow] ${userName}: Click on "Copy all" failed/timed out for ${userName}: ${clickErr.message}`);
//       }
//     } else {
//       console.warn(`[CaptureFlow] ${userName}: FAILED to find "Copy all" button even after recovery.`);
//     }
//
//     // Fallback if collection failed
//     console.warn(`[CaptureFlow] ${userName}: COLLECTION FAILED. Saving fallback log.`);
//     const fallbackText = "failed to fetch stats";
//     const filename = `${userName}_${timestamp}_FAILED.json`;
//     fs.writeFileSync(path.join(sessionPath, filename), fallbackText);
//
//   } catch (error) {
//     console.error(`[CaptureFlow] ${userName}: CRITICAL ERROR during collection:`, error);
//   }
// }

/**
 * Audits all active PeerConnections for 'relay' (TURN) candidates.
 */
async function auditIceCandidates(I) {
  await I.executeScript(async () => {
    if (!window.__pcs || window.__pcs.length === 0) return;

    for (const [index, pc] of window.__pcs.entries()) {
      if (pc.connectionState === 'closed') continue;
      const stats = await pc.getStats();
      let activePair = null;
      const candidateMap = new Map();

      stats.forEach(report => {
        if (report.type === 'candidate-pair' && report.nominated && report.state === 'succeeded') activePair = report;
        if (report.type === 'local-candidate') candidateMap.set(report.id, report);
      });

      if (!activePair) continue;
      const localCandidate = candidateMap.get(activePair.localCandidateId);
      const localType = localCandidate ? localCandidate.candidateType : 'unknown';

      if (localType !== 'relay') {
        throw new Error(`SECURITY AUDIT FAILED: PC[${index}] is using '${localType}'.`);
      }
    }
  });
}

/**
 * Main Test Execution
 */
Feature('WebRTC Call Quality Monitoring');

const parallelCount = parseInt(process.env.PARALLEL_RUNS || '5', 10);
const instances = Array.from({ length: parallelCount }, (_, i) => i + 1);

Data(instances).Scenario('Verify user can join call and capture performance statistics', { timeout: 900 }, async ({ I, current }) => {
  const baseUsername = process.env.USERNAME || 'User';
  const workerId = current;
  const userName = `${baseUsername}_${workerId}`;
  const callUrls = (process.env.CALL_URLS || '').split(',').map(u => u.trim()).filter(Boolean);
  const urlIndex = (workerId - 1) % callUrls.length;
  const selectedCallUrl = callUrls[urlIndex];
  const callLinkDisplayName = `call-link-${urlIndex + 1}`;

  const videoTarget = parallelCount;

  // Phase 0: Staggered Start (Spread joins over 15 seconds)
  const staggerWait = Math.random() * 15;
  console.log(`[Main] ${userName}: Staggered start - waiting ${staggerWait.toFixed(1)}s before joining.`);
  await I.wait(staggerWait);

  // Phase 1: Join the Call
  await joinCall(I, selectedCallUrl, userName);

  // const { sessionPath, runPath } = setupStatsDirectory(userName, callLinkDisplayName);

  // Phase 2: Wait for Media (Tiered Wait Logic)
  console.log(`[JoinFlow] ${userName}: Waiting for video streams (Target: ${videoTarget})...`);
  let currentVideoCount = 0;
  let attempts = 0;
  const maxAttempts = 12; // 1 minute (12 * 5s)

  while (currentVideoCount < videoTarget && attempts < maxAttempts) {
    currentVideoCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.videoStream);
    console.warn(`[JoinFlow] ${userName}: Current visible video streams: ${currentVideoCount} (Target: ${videoTarget}, Attempt: ${attempts + 1}/${maxAttempts})`);

    if (currentVideoCount >= videoTarget) break;

    await I.wait(5);
    attempts++;
  }

  // Extension Phase: If still below target, record screenshots and wait 30s more (Conditional on DEBUG_CALL)
  if (currentVideoCount < videoTarget && process.env.DEBUG_CALL === 'true') {
    const runGroup = process.env.RUN_ID || new Date().toISOString().substring(0, 16).replace(/[:T]/g, '-');
    const failPath = path.join(__dirname, '..', 'stats', runGroup, callLinkDisplayName, 'failed-to-join', userName);
    if (!fs.existsSync(failPath)) fs.mkdirSync(failPath, { recursive: true });

    console.warn(`[JoinFlow] ${userName}: Target not met in 1 min. DEBUG_CALL is true - starting 30s recording phase...`);

    let extraAttempts = 0;
    while (currentVideoCount < videoTarget && extraAttempts < 6) { // 30 seconds (6 * 5s)
      // Save screenshot at each step of the extension
      await I.saveScreenshot(path.join(failPath, `failure_step_${extraAttempts + 1}.png`));

      currentVideoCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.videoStream);
      console.warn(`[JoinFlow] ${userName}: EXTENDED WAIT - Videos: ${currentVideoCount}/${videoTarget} (Attempt: ${extraAttempts + 1}/6)`);
      if (currentVideoCount >= videoTarget) break;
      await I.wait(5);
      extraAttempts++;
    }
  }

  if (currentVideoCount < videoTarget) {
    const totalWait = process.env.DEBUG_CALL === 'true' ? '1m 30s' : '1m';
    const errorMsg = `[JoinFlow] ${userName}: FAILED to join call correctly after ${totalWait} (Saw ${currentVideoCount}/${videoTarget} videos). Cancelling worker.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  console.log(`[JoinFlow] ${userName}: Joined call successfully with ${currentVideoCount} video streams.`);

  // Phase 3: Perform ICE Candidate Audit
  await auditIceCandidates(I);

  // Phase 4: Measurement Loop (Video Count Monitoring)
  const totalIterations = Math.ceil((CONFIG.stats.durationMins * 60) / CONFIG.stats.pollInterval);

  // await openStats(I, userName);

  for (let i = 0; i < totalIterations; i++) {
    await I.wait(CONFIG.stats.pollInterval);

    const videoCount = await I.grabNumberOfVisibleElements(CONFIG.selectors.videoStream);
    console.warn(`[VideoWatchdog] ${videoCount} video(s) visible for ${userName} at "${new Date().toISOString()}"`);

    // await captureAndSaveStats(I, sessionPath, userName);
    // if (workerId === 1) logSystemStats(runPath);
  }

  // Phase 5: Finalize
  await I.pressKey('Escape');
  console.warn(`Escaped key pressed for user ${userName}`);
  await I.moveCursorTo('body', 0, 0);
  console.warn(`Cursor moved for user ${userName}`);
  
  const isEndButtonVisible = await I.grabNumberOfVisibleElements(CONFIG.selectors.endCallButton);
  if (isEndButtonVisible > 0) {
    await I.click(CONFIG.selectors.endCallButton);
  } else {
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';
    await I.pressKey([modifier, 'Shift', 'H']);
  }
  await I.wait(5);
  console.warn(`call ended for ${userName}`);
});