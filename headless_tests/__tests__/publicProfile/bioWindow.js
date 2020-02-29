const profile = require('../../pageObjects/pages/publicProfile');

describe('Add valid/invalid bio and tagline in contributor profile', () => {
  testWithRetry('should check for valid/invalid contributor bio and tagline details', async () => {
    await profile.loginAndNavigate();
    await profile.contributorBio('Tagline', 'email');
    await profile.contributorBio();
  });
});
