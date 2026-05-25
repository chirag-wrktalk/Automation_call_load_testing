# Change: Add logging, screenshots, and run-time folders

**Date:** 2026-05-15  
**Branch:** feat/login-test-case  
**Author:** AI Agent  

## User Ask
1. After entering email, `console.warn(userxxxx@rejolut.dev is logging in)`.
2. After successful login, take a screenshot.
3. After returning back to login page, take a screenshot.
4. Handle all screenshots in 1 folder created at runtime.

## Current Implementation
No runtime folder creation or specific login/return screenshots were implemented.

## New Implementation
- Added `fs` and `path` to handle directory creation.
- Introduced `RUN_ID` and `output/login_run_<RUN_ID>` folder.
- Added `console.warn` after email entry.
- Added `I.saveScreenshot` after OTP entry and after returning to the welcome page.
- Screenshots are named using the user's email for easy identification.

## New Introductions
- Automated screenshot management in unified run folders.

## Decisions & Trade-offs
- Used `new Date().toISOString()` as default `RUN_ID` to ensure uniqueness.
- Sanitize email addresses for use in filenames (replacing `@` and `.` with `_`).

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-15-add-login-test.md and restore the prior implementation."
