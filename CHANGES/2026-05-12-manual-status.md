# Change: Manual Status Check Implementation

**Date:** 2026-05-12  
**Branch:** feat/manual-status  
**Author:** AI Agent  

## User Ask
Instead of adding timer on the button, when user click run test if the test start running succesfully then disable the button and add a get status button under it. Upon clicking the get status check if the test is still running if running say kindly wait X mins. If test is completed then hide the get status and re enable the Run test button.

## Current Implementation
- **Automatic Timer**: The "Run Test" button automatically showed a countdown.
- **Continuous Update**: The UI was updated every second to reflect the remaining time.

## New Implementation
- **Manual Status Button**: Added a "Get Status" button that only appears during active tests.
- **On-Demand Alerts**: Replaced the automatic timer with a manual alert triggered by the "Get Status" button.
- **Button State Management**:
    - **Run Test**: Disabled and labeled as "Test Running..." during execution.
    - **Get Status**: Appears below the run button to provide status on demand.
- **Automatic Cleanup**: The status button is hidden and the run button re-enabled as soon as the backend process emits a "close" event.

## New Introductions
- **`getStatus()` function**: Calculates remaining time based on `activeTestStart` and `activeTestDuration` variables and displays a user-friendly alert.
- **Secondary Action Button Style**: Styled the "Get Status" button to match the glassmorphism theme while appearing distinct from the primary action.

## Decisions & Trade-offs
- **User Intent**: This change shifts the UI from "passive monitoring" to "active inquiry", giving the user more control over when they see the remaining time information.

## Revert Prompt
> "Revert the changes in dashboard/public/index.html to restore the automatic button timer and remove the Get Status button."
