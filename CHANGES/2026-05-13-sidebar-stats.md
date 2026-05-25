# Change: 3-Column Dashboard with Stats Sidebar

**Date:** 2026-05-13  
**Branch:** feat/sidebar-stats  
**Author:** AI Agent  

## User Ask
Implement a new long rectangular card on the right same as the one used for launch test and input fields in the right, the stats go into this rectangular card.

## Current Implementation
- **2-Column Layout**: The dashboard was split between a left sidebar and a wide center terminal.
- **Floating/Inline Stats**: Metrics were displayed in a row above the terminal, taking up horizontal space from the logs.

## New Implementation
- **Triple-Column Architecture**: Redesigned the entire dashboard into a professional 3-column grid:
    1. **Controls (Left)**: Primary inputs and action buttons.
    2. **Console (Center)**: Maximized terminal area for real-time logs.
    3. **Live Stats (Right)**: A new dedicated sidebar card for resource telemetry.
- **Sidebar Integration**: Created a `stats-sidebar` component that mirrors the exact look and feel (glassmorphism, blurs, shadows) of the primary control panel.
- **Animated Transition**: The right sidebar expands smoothly from `0px` to `320px` when a test begins, utilizing a cubic-bezier transition for a premium feel.
- **Vertical Metrics Stack**: Reorganized the metrics cards into a vertical stack within the new sidebar, making better use of screen real estate.

## New Introductions
- **`show-stats` State**: A new CSS class-driven state that controls the layout expansion and sidebar visibility.
- **Sidebar Telemetry Container**: A dedicated space for all performance-related visualizations on the right side of the UI.

## Decisions & Trade-offs
- **Fixed vs. Fluid Widths**: Kept the sidebars at fixed widths (350px/320px) to ensure the control groups and charts remain legible, while the center console remains fluid to adapt to the window size.

## Revert Prompt
> "Revert the 3-column layout in dashboard/public/index.html and move metrics back to the terminal-container."
