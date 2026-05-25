# Change: Spring-Animated Opposing Accordion Drawers with Previews

**Date:** 2026-05-21  
**Branch:** feat/spring-opposing-drawers  
**Author:** AI Agent  

## User Ask
Modify the expandable drawers in the right sidebar to follow high-fidelity animation and layout rules:
- Top drawer (Live Telemetry) and Bottom drawer (Recent Runs).
- Only one can be open at a time.
- Closed drawer slides and fades away in the opposite direction (top slides up, bottom slides down).
- Expanded drawer smoothly takes over the card space using snappy spring transitions.
- Snappy spring animations across height, opacity, translateY, and scale.
- Default compact preview state showing basic previews (CPU/RAM metrics at top, run counter at bottom) with handles visible.

## Current Implementation
The right sidebar accordion used standard CSS height grid toggling. While it toggled between two active states, both drawer headers were always visible and static, and there was no middle "compact preview" default state or spring physics animations (opacity, translation offsets, or slight scale changes).

## New Implementation
1. **Interactive Dual-Preview Architecture:**
   * Structured three classes per drawer container: `.state-compact` (default state), `.state-expanded` (active), and `.state-collapsed` (inactive and hidden).
   * Programmed compact preview elements (`.drawer-preview`) that render when the parent drawer is `.state-compact` and hide when collapsed or expanded.
2. **Spring Physics CSS Transitions:**
   * Applied a snappy spring bezier curve: `cubic-bezier(0.25, 0.8, 0.25, 1.1)` across `all` transitions.
   * **Opposing Translating Offsets:**
     * Top drawer collapses upward: `transform: translateY(-80px) scale(0.92);`
     * Bottom drawer collapses downward: `transform: translateY(80px) scale(0.92);`
   * Active drawer expands fully and smoothly stretches using `flex: 1;`.
3. **Dual State Updates:**
   * Handled real-time telemetry updates: `handleIncomingMetrics(data)` dynamically updates the compact state preview CPU & Memory strings so they remain fully updated when minimized.
   * Handled history list counters: `renderRecentRuns()` dynamically updates the compact state counter (e.g. `2 saved runs available`).
4. **Snappy Orchestration Handler:**
   * Created `clickDrawer(drawerName)` and `setDrawerState(state)` dynamically.
   * Expanding one drawer sets the other to `.state-collapsed` and the active one to `.state-expanded`.
   * Clicking the active header again gracefully collapses it back to the `.state-compact` preview mode, immediately bringing back both handles and compact reviews.
   * Test activation or simulation replays automatically expand the `telemetry` drawer for live viewing and return back to the compact state on completion.

## New Introductions
- Dual preview boxes (`#telemetryPreview`, `#historyPreview`) inside [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).
- `clickDrawer` and `setDrawerState` orchestrators inside [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).

## Decisions & Trade-offs
* *Snappy spring curves:* Selected `cubic-bezier(0.25, 0.8, 0.25, 1.1)` which creates a beautiful, subtle elastic bounce effect at the end of the expansion/collapse, matching modern macOS/iOS UI layouts perfectly.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-21-spring-opposing-drawers-accordion.md and restore the prior implementation."
