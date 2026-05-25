# Change: Split Network Download and Upload Charts in Call-Test Dashboard

**Date:** 2026-05-21  
**Branch:** feat/split-network-charts  
**Author:** AI Agent  

## User Ask
In the call-test dashboard, split the single combined network graph into separate, dedicated graphs for Download (Rx) and Upload (Tx) to make it clear which is which.

## Current Implementation
The dashboard contained a single network metric card displaying a single sparkline that rendered a combined total of Download and Upload speed (`rxKbs + txKbs`). While it had textual representations for individual download/upload speeds, the graph itself was unified and could not differentiate raw download spikes from upload spikes.

## New Implementation
1. **Separated HTML Layout:** Replaced the single combined Network metric card in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html) with two distinct, high-fidelity sidebar cards:
   * **Network Download** displaying a large text status of download speed and a dedicated `<canvas id="netRxChart">` element.
   * **Network Upload** displaying a large text status of upload speed and a dedicated `<canvas id="netTxChart">` element.
2. **Dedicated Telemetry History:** Initialized and decoupled the sparkline array buffers into individual tracking channels (`netRxHistory` and `netTxHistory`).
3. **Harmonious Color Branding:** Refactored the core drawing routine into a dynamic `drawSparkline` function and painted individual color palettes:
   * **Download (Rx):** Emerald green strokes (`#10b981`) and subtle transparent green gradients representing incoming data flow.
   * **Upload (Tx):** Sky blue strokes (`#38bdf8`) and transparent blue gradients representing outgoing data flow.
4. **Fluid Responsiveness:** Adjusted sparkline heights (`35px` each) to ensure that stacking both cards preserves the vertical proportions of the right-hand stats dashboard sidebar.

## New Introductions
- Added a reusable `drawSparkline` canvas drawer utility function in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).

## Decisions & Trade-offs
* *Vertical Stacking:* Stacked the cards vertically inside the flex sidebar to preserve the dashboard's layout consistency without requiring a complete CSS column overhaul, maximizing readablility and aesthetic alignment.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-21-split-network-charts.md and restore the prior implementation."
