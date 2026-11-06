#!/bin/bash
# run-batches.sh - Launch a large load test as staggered batches of ./run.sh --detach
#
# Instead of one huge run, the peers are split into batches (15 by default) and
# each batch is started as its own detached run, INTERVAL seconds apart, so the
# server is not hit by every peer joining at the same instant.
#
# Usage:
#   ./run-batches.sh                      Ask for total peers and the call URL
#   ./run-batches.sh 75                   75 peers -> 5 batches of 15
#   ./run-batches.sh 50 https://call/xyz  50 peers -> 15,15,15,5 (remainder batch)
#
# Fixed per batch: duration 120 mins, media mix all zero (every peer joins with
# mic + video OFF). Each batch gets its own random 2-letter display-name prefix.
#
# Overridable with env vars:
#   BATCH_SIZE=15  INTERVAL=30  DURATION_MINS=120
#
# Stop everything that was started:  ./run.sh --stop

set -u

cd "$(dirname "$0")" || exit 1

BATCH_SIZE=${BATCH_SIZE:-15}
INTERVAL=${INTERVAL:-30}
DURATION_MINS=${DURATION_MINS:-120}

if [ ! -x ./run.sh ]; then
    echo "run.sh not found or not executable in $(pwd)" >&2
    exit 1
fi

# ---- Input: total peers -----------------------------------------------------
total=${1:-}
if [ -z "$total" ]; then
    read -p "Total peers to run (multiple of $BATCH_SIZE, e.g. 30, 75): " total
fi
case "$total" in
    ''|*[!0-9]*)
        echo "Total peers must be a whole number (got: '$total')." >&2
        exit 1
        ;;
esac
if [ "$total" -le 0 ]; then
    echo "Total peers must be greater than 0." >&2
    exit 1
fi

# ---- Input: call URL(s) -----------------------------------------------------
url=${2:-}
if [ -z "$url" ]; then
    echo "Enter Call URL(s) (comma separated). Leave empty to use CALL_URLS from .env:"
    read -p "> " url
fi

# ---- Plan the batches -------------------------------------------------------
# Full batches of BATCH_SIZE, plus one smaller batch for any remainder
# (so 50 becomes 15 + 15 + 15 + 5 rather than being rejected).
batches=$(( (total + BATCH_SIZE - 1) / BATCH_SIZE ))
remainder=$(( total % BATCH_SIZE ))

echo ""
echo "--- Batch Plan ---"
echo "Total peers : $total"
echo "Batches     : $batches  (${BATCH_SIZE} per batch$( [ "$remainder" -ne 0 ] && echo ", last batch $remainder" ))"
echo "Stagger     : ${INTERVAL}s between batch starts"
echo "Duration    : ${DURATION_MINS} mins per batch"
echo "Target      : ${url:-(CALL_URLS from .env)}"
echo "Media mix   : 0 / 0 / 0  (all peers mic + video OFF)"
echo "------------------"
echo ""

# ---- Random, unique 2-letter name prefixes ----------------------------------
used_names=""
rand_name() {
    local letters=abcdefghijklmnopqrstuvwxyz name
    while :; do
        name="${letters:RANDOM%26:1}${letters:RANDOM%26:1}"
        case " $used_names " in
            *" $name "*) continue ;;
        esac
        used_names="$used_names $name"
        printf '%s' "$name"
        return
    done
}

trap 'echo ""; echo "Interrupted. Batches already started keep running - stop them with ./run.sh --stop"; exit 130' INT

started=0
launched_peers=0

for i in $(seq 1 "$batches"); do
    size=$BATCH_SIZE
    if [ "$i" -eq "$batches" ] && [ "$remainder" -ne 0 ]; then
        size=$remainder
    fi
    name=$(rand_name)

    echo "[$i/$batches] Starting $size peers as '${name}_*' ..."

    # Answers fed to run.sh's prompts, in order:
    #   USERNAME, PARALLEL_RUNS, DURATION_MINS, CALL_URLS,
    #   PEERS_MIC_AND_VIDEO, PEERS_MIC_ONLY, PEERS_VIDEO_ONLY (last three blank = 0)
    out=$(printf '%s\n%s\n%s\n%s\n\n\n\n' \
            "$name" "$size" "$DURATION_MINS" "$url" | ./run.sh --detach 2>&1)

    echo "$out" | grep -E "Log file|Started in background" | sed 's/^/    /'

    if echo "$out" | grep -q "Started in background"; then
        started=$((started + 1))
        launched_peers=$((launched_peers + size))
    else
        echo "    WARNING: batch $i did not report a background PID. Full output:" >&2
        echo "$out" | sed 's/^/    | /' >&2
    fi

    if [ "$i" -lt "$batches" ]; then
        echo "    waiting ${INTERVAL}s before the next batch ..."
        sleep "$INTERVAL"
    fi
done

echo ""
echo "--- Done ---"
echo "Started $started of $batches batches ($launched_peers peers)."
echo "  List runs : ./run.sh --list"
echo "  Stop all  : ./run.sh --stop"
