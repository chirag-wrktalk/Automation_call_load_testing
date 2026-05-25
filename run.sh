#!/bin/bash
# run.sh - Interactive WebRTC Load Test Runner

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

echo ""
echo "--- Starting Load Test ---"
echo "Username : ${USERNAME:-User}_1, ${USERNAME:-User}_2, ..."
echo "Workers  : ${PARALLEL_RUNS:- (Reading from .env)}"
echo "Duration : ${DURATION_MINS:- (Reading from .env)} mins"
echo "Target   : ${CALL_URLS:- (Reading from .env)}"
echo "--------------------------"

# Execute the parallel test command
npm run test:call:parallel
