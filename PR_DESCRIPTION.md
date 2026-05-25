## What changed
1. **Interactive Real-Time Load Testing Dashboard:** Built a highly premium, glassmorphism-styled metrics telemetry app using Node.js, Express, Socket.io, and Canvas charts.
2. **Spring-Animated Opposing Drawers Accordion:** Re-engineered the right-hand sidebar into a compact preview system. Built snappy spring CSS transitions utilizing `cubic-bezier(0.25, 0.8, 0.25, 1.1)` which animate height, scale shifts, translations (top slides up, bottom slides down), and opacity automatically.
3. **Persisted Run History and Chronological Replays:** Integrated recording tools that capture logs and CPU/RAM/network metrics. Clicking any historical run launches a fast-forward, 10x speed chronological simulation player that animates telemetry curves in seconds.
4. **Linux Failure Alert Beeps and Notifications:** Integrated notify-send GUI alerts and audible terminal chime bells when workers run into failures.
5. **Cross-Platform Shortcut Modifier Detection:** Added process detection checks to dynamically switch key modifiers to support `Command + Shift + H` on macOS (`darwin`) and `Control + Shift + H` on Linux and Windows.

## Why
1. Parallel load testing requires real-time system performance instrumentation without manually checking multiple terminals.
2. An accordion opposing drawer provides sleek workspace management, keeping metric details compact or letting them smoothly fill the sidebar canvas based on interaction.
3. Playwright coordinate-based clicks on Radical/Radix menus often suffer overlay coordinate failures during sidebar sliding. native JS `.evaluate((el) => el.click())` triggers resolve this completely.
4. Local test machines (macOS vs Linux) have distinct default hotkey shortcuts that throw errors unless resolved dynamically.

## How to test
1. Run the local dashboard:
   ```bash
   cd dashboard
   npm install
   node server.js
   ```
2. Open `http://localhost:8080/call-test/` in your browser.
3. Verify that the **Recent Runs** and **Live Telemetry** accordion handles are visible at the bottom right. Click them to watch the opposing drawers spring open and shut!
4. Trigger a parallel run using a quick test configuration or click a past run to watch the replay player fast-forward the logs and speed sparklines!
5. Run the CodeceptJS suite on macOS to verify that the shortcuts automatically execute using the Command modifier.

## Known side effects
* None. All dashboard telemetry, local storage handlers, and shortcuts are fully isolated and designed to prevent code collision or performance lag.

## Changelog
* [CHANGES/2026-05-21-spring-opposing-drawers-accordion.md](file:///home/aman/Automation-Testing-Scripts/CHANGES/2026-05-21-spring-opposing-drawers-accordion.md)
* [CHANGES/2026-05-21-recent-runs-replay-simulation.md](file:///home/aman/Automation-Testing-Scripts/CHANGES/2026-05-21-recent-runs-replay-simulation.md)
* [CHANGES/2026-05-21-cross-platform-keypress-mac.md](file:///home/aman/Automation-Testing-Scripts/CHANGES/2026-05-21-cross-platform-keypress-mac.md)
