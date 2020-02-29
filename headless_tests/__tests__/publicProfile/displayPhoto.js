const profile = require('../../pageObjects/pages/publicProfile');

describe('Upload photo to the contributor profile', () => {
  testWithRetry('should be able to upload photo to the profile', async () => {
    await profile.loginAndNavigate();
    await profile.uploadProfilePhoto();
    await profile.deleteProfilePhoto();
  });
});
