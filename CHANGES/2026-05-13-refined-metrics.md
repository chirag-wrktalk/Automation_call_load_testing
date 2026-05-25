# Change: Refined Metrics Layout & Detailed Data

**Date:** 2026-05-13  
**Branch:** feat/refined-metrics  
**Author:** AI Agent  

## User Ask
Reduce the height to make the stats into small rectangular cards. Under these cards should be the log screen exactly how it was before only shifted little down now. In network speed show upload and download both. In ram usage show mb/gbs.

## Current Implementation
- **Oversized Cards**: Metrics cards were taking up the full height of the center panel, pushing logs to a small corner.
- **Aggregated Data**: Network was shown as a single throughput value, and RAM was only shown as a percentage.

## New Implementation
- **Compact Rectangular Cards**: Redesigned the metrics grid into slim, horizontal cards that prioritize horizontal space over vertical.
- **Integrated Layout**: Relocated the metrics grid to sit directly above the terminal output. The terminal now spans the full width of the main content area beneath the stats.
- **Dual Network Telemetry**: 
    - Separated metrics into **Download (↓)** and **Upload (↑)**.
    - Updated `server.js` to split `rx` and `tx` bytes during sampling.
- **Detailed Memory Analysis**:
    - Added a `metric-sub` label that displays used memory vs. total capacity in human-readable units (MB/GB).
    - Implemented a `formatBytes()` utility on the frontend for accurate unit conversion.

## New Introductions
- **`formatBytes()` utility**: Client-side helper for converting raw bytes into dynamic units (B, KB, MB, GB, TB).
- **Split Network Logic**: Backend now tracks RX and TX independently for more granular bandwidth monitoring.

## Decisions & Trade-offs
- **Vertical Hierarchy**: Placing metrics above the terminal provides a more logical "Overview -> Details" flow than the previous side-by-side arrangement.

## Revert Prompt
> "Revert the layout changes in dashboard/public/index.html and return the backend metrics in dashboard/server.js to aggregated single-value format."
