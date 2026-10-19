#!/bin/bash
# run.sh - Interactive WebRTC Load Test Runner
#
# Usage:
#   ./run.sh              Run in the foreground (stays awake, logs to file + screen)
#   ./run.sh --detach     Run in the background (survives closing the terminal)
#                         Follow progress with: tail -f logs/<the log file printed below>
#   ./run.sh --list       Show every detached run and whether it is still alive
#   ./run.sh --stop <pid> Stop one detached run (and its whole process tree)

DETACH=0
case "$1" in
    --detach|-d)
        DETACH=1
        ;;
    --list|-l)
        shift
        printf '%-10s %-8s %s\n' "PID" "STATE" "LOG FILE"
        found=0
        for pidfile in logs/*.pid; do
            [ -e "$pidfile" ] || continue
            pid=$(cat "$pidfile" 2>/dev/null)
            [ -n "$pid" ] || continue
            found=1
            if kill -0 "$pid" 2>/dev/null; then
                state="RUNNING"
            else
                state="exited"
            fi
            printf '%-10s %-8s %s\n' "$pid" "$state" "${pidfile%.pid}.log"
        done
        [ "$found" -eq 0 ] && echo "(no detached runs recorded in logs/)"
        exit 0
        ;;
    --stop)
        target_pid="$2"
        if [ -z "$target_pid" ]; then
            echo "Usage: ./run.sh --stop <pid>   (see ./run.sh --list)" >&2
            exit 1
        fi
        # Negate the PID to signal the whole process group, so npm/node/chromium
        # children die with the parent instead of being orphaned.
        if kill -TERM -"$target_pid" 2>/dev/null || kill -TERM "$target_pid" 2>/dev/null; then
            echo "Sent TERM to $target_pid (and its process group)."
        else
            echo "No such running process: $target_pid" >&2
            exit 1
        fi
        exit 0
        ;;
esac

echo "--- WebRTC Load Test Configuration ---"

# 1. Username
read -p "Enter display name prefix (USERNAME) [Default: User]: " user_name
if [ ! -z "$user_name" ]; then
    export USERNAME=$user_name
fi

# 2. Parallel Runs
read -p "Enter number of parallel workers (PARALLEL_RUNS) [Default from .env]: " user_runs
if [ ! -z "$user_runs" ]; then
    export PARALLEL_RUNS=$user_runs
fi

# 3. Duration
read -p "Enter test duration in minutes (DURATION_MINS) [Default from .env]: " user_duration
if [ ! -z "$user_duration" ]; then
    export DURATION_MINS=$user_duration
fi

# 4. Call URLs
echo "Enter Call URL(s) (Comma separated). Leave empty to use CALL_URLS from .env:"
read -p "> " user_urls
if [ ! -z "$user_urls" ]; then
    export CALL_URLS="$user_urls"
fi

# 5. Media Mix (peers are assigned to a category in worker-index order;
#    any leftover workers join with both mic + video OFF)
echo ""
echo "--- Media Mix (leave empty for 0) ---"

# 5a. Peers with both mic + video ON
read -p "Peers with mic + video ON (PEERS_MIC_AND_VIDEO) [Default: 0]: " user_mic_and_video
if [ ! -z "$user_mic_and_video" ]; then
    export PEERS_MIC_AND_VIDEO=$user_mic_and_video
fi

# 5b. Peers with only mic ON (video OFF)
read -p "Peers with only mic ON (PEERS_MIC_ONLY) [Default: 0]: " user_mic_only
if [ ! -z "$user_mic_only" ]; then
    export PEERS_MIC_ONLY=$user_mic_only
fi

# 5c. Peers with only video ON (mic OFF)
read -p "Peers with only video ON (PEERS_VIDEO_ONLY) [Default: 0]: " user_video_only
if [ ! -z "$user_video_only" ]; then
    export PEERS_VIDEO_ONLY=$user_video_only
fi

echo ""
echo "--- Starting Load Test ---"
echo "Username : ${USERNAME:-User}_1, ${USERNAME:-User}_2, ..."
echo "Workers  : ${PARALLEL_RUNS:- (Reading from .env)}"
echo "Duration : ${DURATION_MINS:- (Reading from .env)} mins"
echo "Target   : ${CALL_URLS:- (Reading from .env)}"
echo "Mic+Video: ${PEERS_MIC_AND_VIDEO:-0} | Mic only: ${PEERS_MIC_ONLY:-0} | Video only: ${PEERS_VIDEO_ONLY:-0} | Rest: mic+video OFF"
echo "--------------------------"

# Prepare a timestamped log file so output is never lost with the terminal
mkdir -p logs
LOG_FILE="logs/loadtest-$(date +%Y-%m-%d-%H-%M-%S).log"
echo "Log file : $LOG_FILE"
echo "--------------------------"

# Many parallel Chromium workers chew through file descriptors. Raise the soft
# limit toward the hard limit so we do not hit "Too many open files".
CURRENT_NOFILE=$(ulimit -Sn)
HARD_NOFILE=$(ulimit -Hn)
if [ "$HARD_NOFILE" = "unlimited" ]; then
    ulimit -Sn 65536 2>/dev/null
elif [ "$CURRENT_NOFILE" != "unlimited" ] && [ "$CURRENT_NOFILE" -lt "$HARD_NOFILE" ] 2>/dev/null; then
    ulimit -Sn "$HARD_NOFILE" 2>/dev/null
fi
echo "Open files limit: $(ulimit -Sn)"

# Keep the machine from sleeping mid-run. The tool differs per OS, and on a
# remote/CI Linux host there may be nothing to inhibit at all - that is fine,
# nohup already protects us from the SSH session dropping.
KEEPAWAKE=()
if command -v caffeinate >/dev/null 2>&1; then
    # macOS: -d display, -i idle sleep, -m disk, -s system sleep on AC, -u user active
    KEEPAWAKE=(caffeinate -dimsu)
elif command -v systemd-inhibit >/dev/null 2>&1; then
    # Linux desktop/laptop with systemd
    KEEPAWAKE=(systemd-inhibit --what=idle:sleep:handle-lid-switch \
               --who="run.sh" --why="WebRTC load test in progress" --mode=block)
else
    echo "Note: no sleep-inhibitor available on this host; relying on nohup only."
fi

if [ "$DETACH" -eq 1 ]; then
    # nohup + background: immune to the terminal closing or the SSH session dropping
    # setsid gives the run its own process group so --stop can kill the whole
    # tree (npm -> node -> chromium) rather than just the wrapper.
    if command -v setsid >/dev/null 2>&1; then
        setsid nohup "${KEEPAWAKE[@]}" npm run test:call:parallel > "$LOG_FILE" 2>&1 &
    else
        nohup "${KEEPAWAKE[@]}" npm run test:call:parallel > "$LOG_FILE" 2>&1 &
    fi
    RUN_PID=$!
    # One PID file per run, named to match its log, so concurrent runs
    # do not overwrite each other.
    PID_FILE="${LOG_FILE%.log}.pid"
    echo "$RUN_PID" > "$PID_FILE"
    echo "Started in background (PID $RUN_PID)."
    echo "  Follow logs : tail -f $LOG_FILE"
    echo "  List runs   : ./run.sh --list"
    echo "  Stop the run: ./run.sh --stop $RUN_PID"
else
    # Foreground: tee keeps the live output you are used to AND writes the log file
    "${KEEPAWAKE[@]}" npm run test:call:parallel 2>&1 | tee "$LOG_FILE"
fi
