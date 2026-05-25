# Change: Web Control Panel (Local Dashboard)

**Date:** 2026-05-12  
**Branch:** feat/web-control-panel  
**Author:** AI Agent  

## User Ask
Create a web page with fields for workers, duration, and call link to trigger tests from the UI. Also, implement a way to stream live `console.warn` logs from the terminal to the web page in a searchable, scrollable console box.

## Current Implementation
The test was strictly triggered via CLI (`run.sh` or `npm run`), and logs were only visible in the host terminal.

## New Implementation
- **Dashboard Service**: A Node.js backend running on port **3001** (`dashboard/server.js`).
- **Real-time Streaming**: Integrated `Socket.io` to bridge the `stdout/stderr` of the test process to the browser.
- **Modern UI**: A premium glassmorphism-styled dashboard (`dashboard/public/index.html`) featuring:
    - **Stage Highlighting**: Auto-color coding for logs tagged with `[STAGE I-V]`.
    - **Log Search**: Real-time filtering of incoming console messages.
    - **Process Management**: "Run Test" and "Terminate" buttons to control the backend test execution.

## New Introductions
- **Interactive Control**: Triggers parallel WebRTC tests via HTTP POST requests.
- **Web-based Monitoring**: View test progress without needing direct terminal access.

## Decisions & Trade-offs
- **Isolation**: Placed all logic in a `dashboard/` folder and added it to `.gitignore` to keep experimental tools out of the main repository.
- **Socket.io vs SSE**: Chose Socket.io for bi-directional communication potential (future-proofing for interactive test manipulation).

## Revert Prompt
> "Remove the dashboard/ directory and the dashboard entry in .gitignore."
