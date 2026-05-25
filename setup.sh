#!/bin/bash
# setup.sh - Environment provisioning for WebRTC Load Testing

echo "--- 1. Installing Node Dependencies ---"
npm install

echo "--- 2. Installing Chromium and System Dependencies ---"
# Only install chromium to save time and space
npx playwright install chromium --with-deps

echo "--- 3. Configuring Environment Template ---"
if [ ! -f .env ]; then
    echo "Creating default .env file..."
    cat <<EOT > .env
# Meeting URLs (Comma separated)
CALL_URLS="https://wrktalk-staging--pr-2200-l7hix42p.web.app/call-link/v/rds-bikn-kkz?domain=rejolut.com&backendUrl=https%3A%2F%2Fapi-chirag.wrktalk.com"
# Concurrent workers
PARALLEL_RUNS=4
# Stats collection frequency
POLL_INTERVAL=15
# Total call duration
DURATION_MINS=20
# Performance toggles
PREMUTE=true
DEBUG_CALL=false
HEADLESS=true
EOT
    echo ".env created successfully. Please update it or use run.sh for interactive execution."
else
    echo ".env already exists. Skipping creation."
fi

echo "--- Setup Complete ---"
echo "You can now run tests using: ./run.sh"
