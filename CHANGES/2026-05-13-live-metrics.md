# Change: Live System Metrics Dashboard

**Date:** 2026-05-13  
**Branch:** feat/live-metrics  
**Author:** AI Agent  

## User Ask
Implement to show network speed cpu usage and ram usage in a graphical way live on the site when test starts running.

## Current Implementation
- **Passive Monitoring**: The UI only showed console logs and a basic test progress bar.
- **No Resource Data**: Users had no visibility into how the load test was impacting the server's CPU, RAM, or network bandwidth.

## New Implementation
- **Real-time Metrics Dashboard**: Added a triple-card layout at the top of the terminal that appears when a test is active.
- **Graphical CPU & RAM Usage**: Visualized with high-fidelity progress bars that use smooth cubic-bezier transitions.
- **Live Network Sparkline**: Implemented a custom Canvas-based sparkline chart that plots network throughput over the last 60 seconds.
- **Backend Analytics Engine**: 
    - CPU: Uses differential sampling of `os.cpus()` for accurate load calculation.
    - RAM: Real-time memory pressure calculation.
    - Network: Direct parsing of `/proc/net/dev` to calculate throughput deltas.
- **Automatic State Management**: Metrics UI automatically fades in when a test starts and fades out when it completes.

## New Introductions
- **`metrics` Socket Event**: Dedicated real-time data stream for performance telemetry.
- **Canvas Charting Logic**: Lightweight, dependency-free charting implementation for high performance.
- **Metrics Grid Component**: Modular UI section for system health monitoring.

## Decisions & Trade-offs
- **Sampling Frequency**: Set to 2 seconds to balance real-time responsiveness with low monitoring overhead on the host system.
- **Canvas vs Libraries**: Chose vanilla Canvas for the sparkline to avoid adding external dependencies and to ensure the design perfectly matches the custom theme.

## Revert Prompt
> "Revert the metrics collection in dashboard/server.js and remove the metrics-grid UI from dashboard/public/index.html."
