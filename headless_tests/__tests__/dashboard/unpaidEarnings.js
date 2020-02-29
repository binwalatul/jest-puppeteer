const dashboard = require('../../pageObjects/pages/dashboard');

describe('Unpaid earnings and summary section', () => {
  testWithRetry('should show user unpaid earnings and total earning summary details', async () => {
    await dashboard.loginAndNavigate();
    await dashboard.unpaidEarningsOverview();
    await dashboard.earningsSummaryOverview();
  });
});
