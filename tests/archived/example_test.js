Feature('login');

Scenario('verify login flow on staging', ({ I }) => {
  // Call the custom login method we defined in steps_file.js
  I.login();
});
