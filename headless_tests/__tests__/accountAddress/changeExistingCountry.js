const accounts = require('../../pageObjects/pages/accountAddress');

describe('User is able to change the existing country', () => {
  testWithRetry('Current address country can be changed', async () => {
    await accounts.navigateToPage();
    await accounts.changeExistingAddress('af');
  });
});
