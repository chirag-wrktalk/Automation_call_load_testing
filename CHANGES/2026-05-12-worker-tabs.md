# Change: Worker Log Tabs & Filtering

**Date:** 2026-05-12  
**Branch:** feat/worker-tabs  
**Author:** AI Agent  

## User Ask
Based on the names or worker id can you create tabs on top of the logs box and then when user click on those tabs can see filtered logs of that particular/user?

## Current Implementation
- **Single Stream**: All logs from all workers were interleaved in a single terminal box.
- **Limited Filtering**: Only a text search was available, which made following a single worker's progress difficult in high-concurrency tests.

## New Implementation
- **Dynamic Worker Tabs**: Added a tab bar above the log console that automatically creates a tab for every unique `User_xxxxxx` detected in the log stream.
- **Categorized Views**:
    - **All Logs**: Combined view of everything.
    - **System**: Specifically for system-level messages (e.g., "[SYSTEM] Test process exited").
    - **Worker X**: Individual views for each parallel test runner.
- **Intelligent Filtering**: The UI now applies both the active Tab filter and the Search query together.
- **Session Isolation**: Tabs and log history are automatically cleared when a new test is triggered.

## New Introductions
- **Regex Log Parsing**: The client-side script now extracts identifiers from log patterns like `[User_abc123]`.
- **Tab Management System**: A dynamic DOM generation system for the tab bar.

## Decisions & Trade-offs
- **Client-Side Filtering**: I chose to perform filtering on the client side using a `logStore` array. This provides an instantaneous, snappy UI experience without needing additional round-trips to the server.

## Revert Prompt
> "Remove the tabs-bar from dashboard/public/index.html and revert the log handling logic to the previous single-stream implementation."
