require('dotenv').config();
const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
let isHeadless = process.env.HEADLESS === 'true';


// enable all common plugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './tests/*_test.{js,ts}',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://web-staging.wrktalk.io/welcome',
      windowSize: '960x540',
      show: !isHeadless,
      chromium: {
        args: [
          '--use-fake-device-for-media-stream',
          '--use-fake-ui-for-media-stream',
          '--force-webrtc-ip-handling-policy=default_public_interface_only'
        ]
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  name: 'testing-script'
}
