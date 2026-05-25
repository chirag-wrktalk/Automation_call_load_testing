# Change: Cross-Platform Shortcut Keypress Modifier for macOS Support

**Date:** 2026-05-21  
**Branch:** fix/cross-platform-keypress-mac  
**Author:** AI Agent  

## User Ask
Shortcut keypress is failing on macOS because the platform shortcut maps to `Command + Shift + H` (`cmd shift h`) instead of `Control + Shift + H`.

## Current Implementation
The `tests/joinlinkcall_test.js` script was hardcoded to trigger a keypress array of `['Control', 'Shift', 'H']` when ending calls via keystroke shortcuts. While this worked perfectly on Linux and Windows platforms, macOS applications register the `Command` (or `Meta`) key modifier instead of `Control` for this action, causing execution failures on Mac setups.

## New Implementation
1. **OS Platform Detection:**
   * Introduced a standard Node.js process query: `const isMac = process.platform === 'darwin';` inside the test end conditional branch in [joinlinkcall_test.js](file:///home/aman/Automation-Testing-Scripts/tests/joinlinkcall_test.js).
2. **Dynamic Key Mapping:**
   * Dynamically resolved the active keystroke modifier: `const modifier = isMac ? 'Meta' : 'Control';`.
   * Evaluated the array using the dynamic modifier: `await I.pressKey([modifier, 'Shift', 'H']);`. This maps to `Command + Shift + H` on macOS and `Control + Shift + H` on Windows/Linux environments seamlessly.

## New Introductions
- Operating system conditional modifier resolution block in [joinlinkcall_test.js](file:///home/aman/Automation-Testing-Scripts/tests/joinlinkcall_test.js).

## Decisions & Trade-offs
* *Using standard Node check:* Leveraging `process.platform` runs natively inside the Node environment executing Playwright/CodeceptJS without requiring external packages or user agent header parsing, making it 100% fast, reliable, and lightweight.

## Revert Prompt
> "Revert the changes described in CHANGES/2026-05-21-cross-platform-keypress-mac.md and restore the prior implementation."
