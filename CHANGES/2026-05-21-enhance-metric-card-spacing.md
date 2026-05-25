# Change: Enhance Metric Card Heights and Decouple Wrapped Labels

**Date:** 2026-05-21  
**Branch:** feat/enhance-metric-card-spacing  
**Author:** AI Agent  

## User Ask
Increase the height of the metric boxes showing the upload and download speeds for a cleaner and more spacious UI layout.

## Current Implementation
The telemetry sidebar boxes (`.metric-card`) were restricted to a `min-height: 100px` with the sparkline canvases limited to `35px`. Additionally, the long header labels `"Network Download"` and `"Network Upload"` competed for horizontal space with the speed rate figures (e.g. `↓ 2.7 MB/s`), resulting in forced text-wrapping and a cramped, cluttered appearance.

## New Implementation
1. **Expanded Vertical Dimensions:**
   * Increased the global minimum metric card height (`.metric-card`) from `100px` to `120px` to invite structural breathing room.
   * Scaled up both individual sparkline canvas heights (`#netRxChart, #netTxChart`) from `35px` to `55px`, resulting in more spacious and legible real-time wave curves.
2. **Horizontal Label Optimization:**
   * Shortened the card headers from `"Network Download"` and `"Network Upload"` to `"Download"` and `"Upload"`.
   * Since the cards reside in the network section, this maintains complete semantic context while releasing enough horizontal space to let the speed figures align side-by-side perfectly on a single line, completely preventing visual text-wrapping.

## New Introductions
- Expanded spatial CSS parameters inside [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).

## Decisions & Trade-offs
* *Universal Card Min-Height:* Making all metric cards share the `120px` bounds guarantees vertical layout harmony and absolute visual symmetry down the sidebar list.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-21-enhance-metric-card-spacing.md and restore the prior implementation."
