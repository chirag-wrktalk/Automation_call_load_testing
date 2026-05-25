# Change: Status Flyout Implementation

**Date:** 2026-05-12  
**Branch:** feat/status-flyout  
**Author:** AI Agent  

## User Ask
Change the prompt that says x mins remaining to a ui flyout from the left that says accurately x mins xx sec remaining.

## Current Implementation
- **Alert Dialog**: Clicking "Get Status" triggered a blocking browser alert with a rounded minute estimate.
- **Static Info**: The information was a snapshot and did not update while the alert was open.

## New Implementation
- **Premium Side Flyout**: Replaced the alert with a glassmorphism side panel that slides in from the left.
- **Real-time Countdown**: The flyout displays an accurate `MM:SS` timer that updates every second while visible.
- **Visual Progress Bar**: Added a progress bar to the flyout that visually represents the percentage of test completion.
- **Interactive Controls**: Users can manually close the flyout via an 'X' button, or it will close automatically when the test session ends.

## New Introductions
- **`statusFlyout` Component**: A dedicated UI element with specialized animations and real-time state synchronization.
- **Progress Tracking Logic**: New client-side logic to calculate and visualize percentage completion based on the server-provided start time.

## Decisions & Trade-offs
- **Animation Performance**: Used CSS `transform` and `backdrop-filter` for smooth, high-performance transitions that maintain the "premium" feel.
- **Update Frequency**: Set the update interval to 1s to match the `MM:SS` format without causing unnecessary CPU overhead.

## Revert Prompt
> "Revert the changes in dashboard/public/index.html to restore the browser alert and remove the status flyout logic."
