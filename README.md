# Automation Testing Scripts

This repository contains automated testing scripts built using [CodeceptJS](https://codecept.io/) with the [Playwright](https://playwright.dev/) framework.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:
- **Node.js** (v14 or higher recommended) - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

These prerequisites apply across **Windows**, **Linux**, and **macOS**. 

### Installing Node.js on Linux or macOS (optional alternative)
If you prefer using a package manager:
- **Ubuntu/Debian (Linux):** `sudo apt update && sudo apt install nodejs npm`
- **macOS (using Homebrew):** `brew install node`

## Setup Instructions

Follow these steps to set up the automation environment on any operating system (Windows, Linux, or macOS).

**1. Clone the repository**

Open your terminal or command prompt and run:
```bash
git clone https://github.com/Aman-Wrktalk/Automation-Testing-Scripts.git
cd Automation-Testing-Scripts
```

**2. Install project dependencies**

Install the necessary Node.js packages by running:
```bash
npm install
```

**3. Install Playwright browsers**

Playwright requires specific browser binaries (Chromium, Firefox, WebKit) to run the automated tests. Install them using the following command:
```bash
npx playwright install
```

*Note: On Linux, you might need to install additional system dependencies for the browsers. Playwright will usually prompt you or provide a command (e.g., `npx playwright install-deps`) if anything is missing.*

## Environment Configuration

This project uses `dotenv` to manage environment variables for load testing. Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following configuration:

```env
# Comma-separated list of room URLs
CALL_URLS=https://web-staging.wrktalk.io/room/alpha,https://web-staging.wrktalk.io/room/beta

# Number of parallel browser instances
PARALLEL_RUNS=10
```

- **`CALL_URLS`**: The URLs workers will join. Workers are distributed using round-robin logic.
- **`PARALLEL_RUNS`**: Total number of concurrent users to simulate.


## Running the Tests

Once the setup is complete, you can run your test suite. 

To execute the tests with step-by-step output, run:
```bash
npm run test
```

This command runs `codeceptjs run --steps` under the hood, executing standard tests defined in the `tests/` directory.

### 1. Parallel Call Load Testing

To run the parallel WebRTC load test and capture performance statistics:

```bash
npm run test:call:parallel
```

### 2. Mass Login Load Testing

To simulate concurrent users executing high-frequency sign-in, authentication verification, and sign-out loops:

```bash
npm run test:login:parallel
```

#### Mass Login Controls & Environment Variables
Optimize and control the sign-in loops using these `.env` properties:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `START_USER_NUM` | `20000` | Start number of user email sequence (e.g., `user20000@rejolut.dev`). |
| `END_USER_NUM` | `70000` | End number of user email sequence (e.g., `user70000@rejolut.dev`). |
| `PARALLEL_RUNS` | `10` | Total parallel worker threads/instances executing in CodeceptJS. |
| `ITERATION_DELAY_MS` | `0` | Delay pause (in ms) introduced between each login attempt iteration. |
| `ITERATION_JITTER_MS` | `0` | Random jitter offset (in ms) appended to the pause to mimic real user patterns. |
| `ERROR_WAIT_SEC` | `3` | Grace pause duration (in seconds) applied after a failure to prevent rapid loops. |
| `FAILURE_WEBHOOK_URL`| `None` | (Optional) Slack/Discord-compatible HTTP webhook url to send markdown alerts. |

#### Failure Alerts & Output Log
When a login fails (e.g., OTP field timeout or unregistered email), the script immediately triggers:
1. **Linux GUI Bubble Notification:** Emits a visual desktop warning bubble via `notify-send -u critical`.
2. **Terminal Chime Alert:** Plays an audible console beep alarm (`echo -e "\a"`).
3. **Consolidated Failures Tracker:** Appends the exact failing email address along with its detailed Playwright stack trace error description inside `output/failed_logins.txt`.

### 3. WebRTC Performance Telemetry Dashboard

An interactive, glassmorphic real-time telemetry panel streams load test variables and lets you simulate past runs.

#### Launching the Dashboard:
```bash
cd dashboard
npm install
node server.js
```
Open `http://localhost:8080/call-test/` in your browser.

#### Premium Features:
* **Opposing Accordion Drawers:** Manage workspace space easily with a spring-animated right panel. Expand **Live Telemetry** (CPU, RAM, Green/Blue separate Network sparklines) or **Recent Runs** smoothly.
* **Chronological Run Replays:** Stores the last 2 completed runs. Clicking a past card sets the page to **Replay Mode**, clearing metrics and fast-forwarding the saved run timeline at 10x speed.

### Performance & Stability Controls

The script supports several environment variables to optimize performance and aid in debugging:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PARALLEL_RUNS` | `5` | Number of concurrent workers. |
| `HEADLESS` | `true` | Runs browser in background (set to `false` for debugging). |
| `PREMUTE` | `true` | Mutes microphone before joining to save CPU. |
| `DEBUG_CALL` | `false` | Enables extended failure capture (Screenshots + 30s grace period). |
| `POLL_INTERVAL` | `10` | Frequency of stats collection (seconds). |

### Advanced Features

#### 1. Unique Run Synchronization (`RUN_ID`)
Every time you execute `npm run test:call:parallel`, a unique ID is generated (e.g., `2026-05-08-14-30-05`). 
*   This ensures that all workers in that run save their results in the **same folder**.
*   It prevents data collisions if you launch multiple test groups simultaneously.

#### 2. Media Negotiation Safeguard (Wait Loop)
To ensure tests don't fail due to slow network/CPU, the join flow uses a tiered waiting logic:
*   **Tier 1 (1 minute)**: Wait for 5 video streams.
*   **Tier 2 (30 seconds)**: Only triggers if `DEBUG_CALL=true`. Captures iterative screenshots every 5 seconds to provide visual evidence of why media is failing to negotiate.

#### 3. Results Organization
Results are stored in the `stats/` directory with the following structure:
*   **Successful Joins**: `stats/[RUN_ID]/[LINK]/[USER]/` (Contains JSON stats + warning logs).
*   **Failed Joins**: `stats/[RUN_ID]/[LINK]/failed-to-join/[USER]/` (Contains a visual timeline of the failure).

---

### Getting Started

1. **Setup**: Run `./setup.sh` to install dependencies and create a default `.env`.
2. **Execute**: Run `./run.sh`. The script will interactively ask you for:
   *   `PARALLEL_RUNS` (Number of workers)
   *   `DURATION_MINS` (Test length)
   *   `CALL_URLS` (Meeting links)
3. **Advanced Debug**: To enable screenshots and extended wait times, set `DEBUG_CALL=true` in your `.env` or pass it before running: `DEBUG_CALL=true ./run.sh`

## WebRTC Performance Statistics

The load tests capture a comprehensive set of metrics to help analyze call quality and evaluate network performance (STUN/TURN usage).

### Directory Structure
Logs are saved in the `stats/` folder using the following hierarchy:
```text
stats/
└── <YYYY-MM-DD-HH-mm>/           # Timestamped run folder
    └── <call-link-index>/         # Sub-folder per room (e.g., call-link-1)
        └── <User_ID>/             # Unique folder per simulated user
            └── <User_ID>_<timestamp>.json
```

### Metrics Captured

#### 1. Connection & Metadata
- **Strict TURN Audit**: Mandatory check ensuring `relay` candidate usage.
- **Candidate Types**: Captures `local` and `remote` types to verify infrastructure routing.
- **Transport**: `bytesSent`, `bytesReceived`, `packetsSent`, `packetsReceived`, and `Round Trip Time (RTT)`.

#### 2. Outbound RTP (Outgoing Streams)
- **Flow**: `packetsSent`, `bytesSent`, `targetBitrate`, `retransmittedPacketsSent`.
- **Video**: `framesEncoded`, `framesSent`, `qualityLimitationReason`, and `qualityLimitationDurations`.
- **Signaling**: `nackCount`, `pliCount`, `firCount`.

#### 3. Inbound RTP (Incoming Streams)
- **Network**: `packetsReceived`, `packetsLost`, `jitter`, `jitterBufferDelay`.
- **Video Quality**: `framesDecoded`, `framesDropped`, `framesPerSecond`, `frameWidth`, `frameHeight`.
- **Audio Quality**: `audioLevel`, `concealedSamples`, `concealmentEvents`.

## Reliability & Observability Features

### 1. Automated UI Recovery
High-concurrency tests often face "stuck" UI states. The script implements:
- **Element Retries**: Explicit waits for name input and join buttons.
- **Smart Refresh**: If a worker fails to find the entry form, it automatically refreshes the page and retries once before failing.

### 2. Stats Collection Guardrails
- **Auto-Modal Management**: If the debug panel is closed by UI glitches, the script detects its absence and attempts to re-click the "Show Stats" button.
- **Error Logging**: If stats collection fails for a specific interval, a JSON error file (e.g., `User_ID_timestamp_ERROR.json`) is generated to maintain audit continuity.

### 3. Video Visibility Watchdog
- Continuously checks for the presence of visible `<video>` elements.
- Logs timestamps and user IDs to the console if no video is visible, helping identify "black screen" issues during load tests.


## Project Structure

- `tests/` - Directory containing test files.
    - `joinlinkcall_test.js` - Script for parallel WebRTC load testing and stats capture.
    - `archived/` - Directory for legacy or example tests.
- `stats/` - (Auto-generated) Contains performance JSON logs organized by timestamp.
- `codecept.conf.js` - Configuration for CodeceptJS and Playwright (includes WebRTC fake media flags).
- `package.json` - Project metadata and scripts.
- `.env` - Environment variables (ignored by git).

