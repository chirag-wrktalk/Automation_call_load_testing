# Change Tracking: Separated Setup and Interactive Run Scripts

## Current Implementation (Before this change)
A single `setup_and_run.sh` script handled both installation and execution. Execution was non-interactive and relied entirely on values stored in the `.env` file.

## User Ask
1. Separate the setup and run scripts.
2. In the `run.sh` script, always ask the user for:
   - `PARALLEL_RUNS`
   - `DURATION_MINS`
   - `CALL_URLS`

## New Implementation
### setup.sh
Handles dependency installation and initial `.env` templating.
### run.sh
Interactive bash script using `read` to capture parameters. It then passes these values as environment overrides to the `npm run test:call:parallel` command.

## New Introduction
- **Interactive Configuration**: Users can now tune their load tests at runtime without file editing.
- **Workflow Separation**: Clean separation between environment provisioning (`setup.sh`) and test execution (`run.sh`).

## Prompt to revert back here
"Revert the scripts back to a single 'setup_and_run.sh' file and remove the interactive prompts from the execution flow."
