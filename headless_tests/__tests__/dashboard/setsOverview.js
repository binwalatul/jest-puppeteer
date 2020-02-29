const dashboard = require('../../pageObjects/pages/dashboard');

describe('Sets overview section', () => {
  testWithRetry('should allow users to add or remove published sets on dashboard', async () => {
    await dashboard.loginAndNavigate();
    await dashboard.setsOverview('image');
    await dashboard.setsOverview('video');
  });
});
