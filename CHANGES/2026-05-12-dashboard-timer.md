# Change: Dashboard Timer & Process Cleanup

**Date:** 2026-05-12  
**Branch:** feat/dashboard-timer  
**Author:** AI Agent  

## User Ask
In the dashboard remove the terminate options and instead show timer on the test running button based on the duration mins user inputted.

## Current Implementation
- **Manual Termination**: A "Terminate" button sent a `SIGINT` to the top-level `npm` process.
- **Incomplete Cleanup**: Worker processes often remained running because signals weren't propagated.
- **No Progress Indicator**: The UI didn't show how much time was left in a test.

## New Implementation
- **Process Group Killing**: Updated `server.js` to spawn tests with `detached: true` and use `-pid` to kill the entire process group, ensuring no orphan workers remain.
- **Countdown Timer**: The "Run Test" button now transforms into a "Running (MM:SS)" indicator with a countdown.
- **State Persistence**: The server now tracks `startTime` and `duration`, allowing the dashboard to sync the timer even if the browser is refreshed.
- **UI Cleanup**: Removed the "Terminate" button and its associated styles.

## New Introductions
- **Socket.io `status` Event**: Syncs running state and timing data to all connected clients.
- **SVG Spinner**: Added a subtle micro-animation to the button during execution.

## Decisions & Trade-offs
- **Removal of Abort**: The user explicitly asked to remove the terminate option, simplifying the UI but requiring users to wait for the test to finish naturally.
- **Server-Side Truth**: Storing the start time on the server ensures all connected dashboards see the same accurate countdown.

## Revert Prompt
> "Revert the changes in dashboard/server.js and dashboard/public/index.html to restore the terminate button and remove the timer logic."
