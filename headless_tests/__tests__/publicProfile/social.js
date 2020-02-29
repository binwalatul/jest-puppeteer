const profile = require('../../pageObjects/pages/publicProfile');

describe('Add social links contributor profile', () => {
  testWithRetry('should check for contributor social details', async () => {
    await profile.loginAndNavigate();
    await profile.socialMedia();
  });
});
