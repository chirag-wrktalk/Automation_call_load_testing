# Change: Dashboard State Fix & Reset Feature

**Date:** 2026-05-13  
**Branch:** fix/ui-desync-reset  
**Author:** AI Agent  

## User Ask
The state of button run test and stats appearing is not happening correctly. It happens when i run the test and then reload the page once. Correct the event and listener for it. Also add a button on the left rectangle card bottom saying Reset. upon clicking it dump all the logs on the website as if the website has been just opened.

## Current Implementation
- **Delayed UI Updates**: The server only broadcasted the `status` event on process exit or new connections. Existing clients wouldn't know a test had started until they reloaded.
- **Permanent History**: Logs accumulated indefinitely in the browser session with no way to clear them except for a full page refresh.

## New Implementation
- **Immediate State Synchronization**:
    - Updated `server.js` to broadcast the `status` event immediately after the test process is spawned.
    - This triggers the "Test Running" button state and the "Stats Sidebar" expansion instantly for all connected users.
- **Dashboard Reset Functionality**:
    - Added a **Reset Dashboard** button at the bottom of the control panel sidebar.
    - Implemented `resetDashboard()` to wipe the `logStore`, reset the worker-specific tabs bar, and clear the terminal output.
    - Added a system confirmation before resetting if a test is currently in progress.

## New Introductions
- **`io.emit('status')` on start**: Ensures the dashboard reflects the real-time state of the backend test runner across all sessions.
- **`resetDashboard()`**: A client-side cleanup utility to keep the workspace organized during long testing sessions.

## Decisions & Trade-offs
- **Client-side vs Server-side Reset**: Chose a client-side reset for logs to allow users to clear their own view without affecting the actual server process or log files on disk.

## Revert Prompt
> "Remove the Reset Dashboard button from dashboard/public/index.html and delete the status broadcast from the /start endpoint in dashboard/server.js."
