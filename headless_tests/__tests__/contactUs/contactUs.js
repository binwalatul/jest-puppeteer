const contactUs = require('../../pageObjects/pages/contactUs');

describe('User is able to see existing topics and can report the issue', () => {
  testWithRetry('User can report accounts related issues', async () => {
    await contactUs.loginAndNavigate();
    await contactUs.submitQuery('Accounts');
  // User can report sign up related issues
    await contactUs.submitQuery('SignUp');
  // User can report portfolio related issues
    await contactUs.submitQuery('Portfolio');
  // User can report bug
    await contactUs.submitQuery('ReportBug');
  // User can see the expected topic options on the page
    await contactUs.copyCheck();
  });
});
