const profile = require('../../pageObjects/pages/publicProfile');

describe('public sets are visible on the contributor profile page', () => {
  testWithRetry('should check for the public sets on the page', async () => {
    await profile.loginAndNavigate('existing');
    await profile.publicSets();
  });
});
