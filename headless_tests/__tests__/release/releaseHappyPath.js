const release = require('../../pageObjects/pages/release');

describe('User is able to view the uploaded release', () => {
  testWithRetry('User can edit the uploaded release', async () => {
    await release.loginAndNavigate();
    await release.editRelease('ethnicity');
    await release.editRelease('ages');
    await release.editRelease('gender');
    await release.checkEmptyState();
    await release.moveTo('Archived');
  // User can see the archived release
    await release.checkUpdatedDetails();
    await release.moveReleaseToActive();
    await release.moveTo('Active');
  // User is able to see the uploaded release
    await release.previewRelease();
  });
});
