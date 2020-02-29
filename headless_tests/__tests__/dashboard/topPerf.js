const dashboard = require('../../pageObjects/pages/dashboard');

describe('Top performer section', () => {
  testWithRetry('should show the top performing media on the page', async () => {
    await dashboard.loginAndNavigate();
    await dashboard.topPerfOverview();
  });
});
