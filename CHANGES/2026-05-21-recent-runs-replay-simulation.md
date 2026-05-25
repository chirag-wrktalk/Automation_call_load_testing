# Change: Telemetry & Logs Replay Simulation for Recent Runs

**Date:** 2026-05-21  
**Branch:** feat/recent-runs-replay-simulation  
**Author:** AI Agent  

## User Ask
Keep the logs of a single run in storage and display the last 2 runs in a sidebar list. Clicking a past run should load up and replay all values (logs and metrics) received during that time to simulate exactly what happened during that test.

## Current Implementation
The dashboard was stateless: once a test was started, logs and metrics streamed directly through WebSocket listeners. If a test run finished or the page was refreshed, all logs and metric curves were cleared permanently. There was no mechanism to review historical run data or simulate a past test run.

## New Implementation
1. **Premium Historical UI List:**
   * Appended a glassmorphic **"Recent Test Runs"** section at the bottom of the control sidebar panel in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).
   * Styled clickable historical run items (`.run-history-item`) with glass border borders, smooth scale transitions, and violet hover feedback matching the premium dashboard look.
2. **Persistent Run Storage:**
   * Programmed an active recorder that collects chronological logs and system telemetry metric snapshots in real-time when a socket-driven test run is initiated.
   * On test completion, saves the telemetry bundle inside `localStorage` (capping at the last 2 entries to prevent storage bloating or memory fragmentation, keeping operations lightning fast).
3. **Decoupled Simulation Playback Engine:**
   * Structured separate, generic functions for incoming messages: `handleIncomingLog(data)` and `handleIncomingMetrics(data)`.
   * Standard socket listeners delegate to these handlers directly.
4. **Chronological Replay Player:**
   * When a past run is clicked, the engine checks for live testing (blocking play if active).
   * Puts the dashboard into **"Replay Mode"** (with a dedicated amber/orange pulsing status dot).
   * Clears the active console terminal, resets the network download/upload sparklines, and opens the statistics sidebar.
   * Compiles, sorts all logs and metrics chronologically by their relative timestamps, and replays them at a fast-forward simulation speed (100ms intervals) so developers can watch the entire timeline animate dynamically in seconds!

## New Introductions
- Reusable `handleIncomingLog` and `handleIncomingMetrics` pipeline functions in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).
- `saveRecording`, `renderRecentRuns`, and `replayRun` simulation players in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).

## Decisions & Trade-offs
* *Storage Choice (`localStorage`):* Leveraged standard `localStorage` instead of raw cookies because standard cookies are limited to a strict 4KB size, which is immediately exceeded by log bundles. `localStorage` provides up to 5MB–10MB of local sandbox space per origin.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-21-recent-runs-replay-simulation.md and restore the prior implementation."
