# Change: Opposing Accordion Drawers in Right Stats Sidebar

**Date:** 2026-05-21  
**Branch:** feat/opposing-drawers-accordion  
**Author:** AI Agent  

## User Ask
Move the replay history list feature to the rectangular stats card sidebar on the right, implementing it inside a beautiful accordion-style opposing drawers system.

## Current Implementation
The recent test runs history list sat statically on the left control sidebar beneath the parameter inputs. The right sidebar displayed live telemetry metrics (CPU, RAM, Rx, Tx) statically, which didn't allow for visual toggling or compact layout grouping.

## New Implementation
1. **Relocated Historical Replays:**
   * Removed the Recent Runs list entirely from the left controls sidebar, keeping the left panel perfectly focused on input actions and run triggers.
2. **Opposing Drawer UI Elements:**
   * Converted the right-hand stats sidebar in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html) into an accordion holding two major drawers:
     * **"Live Telemetry" Drawer:** Holds CPU load, RAM usage, and green/blue network sparklines.
     * **"Recent Runs" Drawer:** Holds the saved local test run cards.
3. **Smooth CSS Grid Transitions:**
   * Defined `.drawer-header` and `.drawer-content` styling in CSS.
   * Utilized the premium `grid-template-rows: 0fr` (collapsed) to `1fr` (expanded) transition trick to animate drawer expansions smoothly without relying on fixed height limits.
   * Added interactive hover scaling and chevrons that rotate by 180 degrees when active.
4. **Coordinated JS Orchestrator:**
   * Added `toggleDrawer(drawerName)` switcher that manages `.active`, `.collapsed`, and `.expanded` classes dynamically.
   * Standard socket listener runs automatically activate and expand the `"Live Telemetry"` drawer to show telemetry live.
   * Replay runs automatically expand the `"Live Telemetry"` drawer so the user immediately sees the metrics chart simulation dance, while preserving their entry inside the opposing drawer list.

## New Introductions
- CSS opposing drawers accordion rules in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).
- `toggleDrawer` state manager function in [index.html](file:///home/aman/Automation-Testing-Scripts/dashboard/public/index.html).

## Decisions & Trade-offs
* *Accordion Drawer Exclusive Focus:* Used single-active states (opposing drawers) so expanding one completely collapses the other, giving the stats sidebar absolute visual neatness.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-21-opposing-drawers-accordion.md and restore the prior implementation."
