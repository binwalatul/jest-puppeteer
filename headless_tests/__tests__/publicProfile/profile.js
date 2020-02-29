const profile = require('../../pageObjects/pages/publicProfile');

describe('Add details to the contributor profile', () => {
  testWithRetry('should be able to add new details to the profile', async () => {
    await profile.loginAndNavigate();
    await profile.displayName();
    await profile.location();
    await profile.website();
    await profile.contributorType();
    await profile.contributorStyles();
    await profile.subjects();
    await profile.equipment();
    await profile.saveStatus();
  });
});
