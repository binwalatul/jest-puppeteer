const header = require('../../pageObjects/pages/header');

describe('Header urls', () => {
  testWithRetry('header urls are expected', async () => {
    await header.loginAndNavigate();
    await header.dropdownUrls();
  });
});
