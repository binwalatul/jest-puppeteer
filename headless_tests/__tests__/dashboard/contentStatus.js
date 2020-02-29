const dashboard = require('../../pageObjects/pages/dashboard');

describe('Content status section', () => {
  testWithRetry('should display accurate content count for any type of media', async () => {
    await dashboard.loginAndNavigate();
    await dashboard.uploadHrefs();
    await dashboard.contentOverview('image');
    await dashboard.contentOverviewCount('image');
    await dashboard.contentOverview('Videos');
    await dashboard.contentOverviewCount('Videos');
  });
});
