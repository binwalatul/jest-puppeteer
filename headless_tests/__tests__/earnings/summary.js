const summary = require('../../pageObjects/pages/earnings');

describe('Earnings summary page', () => {
  testWithRetry('should access all the earnings related items for the user', async () => {
    await summary.loginAndNavigate();
    await summary.allTimeEarnings();
    await summary.downloadSpreadsheet();
    await summary.viewAllDates();
    await summary.navigationTabs();
  });
});
