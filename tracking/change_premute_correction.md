# Change Tracking: PREMUTE Logic and Documentation Correction

## Current Implementation (Before this change)
- `README.md` stated that `PREMUTE` mutes both mic and video.
- `tests/joinlinkcall_test.js` was hardcoded to attempt to mute the microphone for every join, ignoring the environment variable.

## User Ask
Clarify that `PREMUTE` only mutes the microphone.

## New Implementation
1. **README.md**: Updated description to "Mutes microphone before joining to save CPU."
2. **tests/joinlinkcall_test.js**: Wrapped the mic-muting logic in `if (process.env.PREMUTE === 'true')`.

## New Introduction
- **Strict Audio-Only Mutting**: Corrected the behavior to match the user's intent—only the microphone is toggled.
- **Environment Driven**: Restored the ability to disable pre-join muting by setting `PREMUTE=false`.

## Prompt to revert back here
"Revert the PREMUTE logic to always attempt to mute the microphone regardless of environment variables and update the README to mention mic/video."
