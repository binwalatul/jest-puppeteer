const dashboard = require('../../pageObjects/pages/dashboard');

describe('Additional Resources & Announcement section', () => {
  testWithRetry('should show user relavant hyperlinks ', async () => {
    await dashboard.loginAndNavigate('pool');
    await dashboard.announcementSection();
    await dashboard.additionalResourceSection();
  });
});
