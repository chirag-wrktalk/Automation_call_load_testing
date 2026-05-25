// in this file you can append custom step methods to 'I' object

module.exports = function () {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    login: function () {
      // 1. Visit the staging URL
      this.amOnPage("https://web-staging.wrktalk.io/welcome");

      // Wait for and click 'Agree and Continue'
      this.waitForText('Agree and Continue', 5, 'button');
      this.click('Agree and Continue', 'button');

      // 2. Verify we see the 'Login' screen
      this.waitForText('Login', 5, 'p');
      this.see('Login', 'p');

      // 3. Verify the email input exists, then fill it
      this.seeElement('input[placeholder="Enter your email address"]');
      this.fillField('input[placeholder="Enter your email address"]', 'batak.1@rejolut.com');

      // 4. Verify the 'Next' button becomes enabled (wait for the disabled attribute to vanish)
      // Playwright supports advanced CSS selectors for this:
      this.waitForElement('button:has-text("Next"):not([disabled])', 5);

      // 5. Click the 'Next' button using the exact CSS selector
      this.click('button:has-text("Next")');

      // 6. Wait for the confirmation dialog (since it takes a bit to slide in)
      this.waitForText('You entered the email id', 5, 'h2');

      // 7. Verify the dialog shows the correct email and text
      this.see('batak.1@rejolut.com', 'p');
      this.see('Is this Ok, or would you like to edit the email id ?', 'p');

      // 8. Verify the presence of Edit and OK buttons
      this.see('Edit', 'button');
      this.see('OK', 'button');

      //9. Click the 'OK' button
      this.click('button:has-text("OK")');
      // 10. Wait for the OTP screen to load
      this.waitForText('Verifying', 10, 'p');
      this.see('Verifying', 'p');

      // 11. Verify the OTP email message
      this.see('Your One Time Password (OTP) has been sent to your given email address', 'p');
    }
  });
}
