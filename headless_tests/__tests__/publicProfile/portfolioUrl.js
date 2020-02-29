const profile = require('../../pageObjects/pages/publicProfile');

describe('Add new protfolio url', () => {
  testWithRetry('should check for addtion of new portfolio url', async () => {
    await profile.loginAndNavigate();
    await profile.portfolioUrl();
  });
});
