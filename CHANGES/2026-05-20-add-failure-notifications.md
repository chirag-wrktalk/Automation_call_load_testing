# Change: Add Multi-Channel Failure Notifications to Load Test Script

**Date:** 2026-05-20  
**Branch:** feat/add-failure-notifications  
**Author:** AI Agent  

## User Ask
Implement an automated notification mechanism so the user knows instantly when a worker encounters an iteration failure during parallel load runs, without having to actively monitor the terminal logs.

## Current Implementation
When a parallel worker caught an iteration error, it wrote the error context silently to the local consolidated failures file `output/failed_logins.txt` and logged it in stdout, but offered no push notifications or real-time audio/visual alerts.

## New Implementation
Upgraded the `catch` handler inside the scenario loop of [tests/login_test.js](file:///home/aman/Automation-Testing-Scripts/tests/login_test.js) to trigger three concurrent notification channels immediately:
1. **Linux Desktop Notification (GUI Bubble):** Invokes the system standard utility `notify-send -u critical` to display a pop-up alert bubble directly on the developer's Linux screen.
2. **Terminal Alert Beep (Audio Alert):** Dispatches shell command `echo -e "\a"` to trigger an audible terminal beep, notifying the developer if they are in a different IDE tab or desktop workspace.
3. **Optional HTTP Webhook Notification:** If the environment variable `FAILURE_WEBHOOK_URL` is defined, the worker posts a Slack/Discord-compatible JSON payload containing detailed worker/user/error telemetry.

## New Introductions
- Imported native Node.js core modules: `child_process`, `http`, `https`, and `url`.
- Introduced shell subprocess triggers inside test catch routines.

## Decisions & Trade-offs
* *Local-First Alerts:* Chose system-native utilities (`notify-send` and `echo \a`) because they run out of the box on the developer's Linux environment with zero setup, API keys, or internet requirements.
* *Standard Webhook Support:* Included standard HTTP POST webhooks to allow direct integration with Slack, Discord, or the developer's Webhook Testing Server on-demand.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-20-add-failure-notifications.md and restore the prior implementation."
