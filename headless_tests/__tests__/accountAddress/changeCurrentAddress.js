const accounts = require('../../pageObjects/pages/accountAddress');

describe('User is able to change the existing address', () => {
  testWithRetry('Current address can be changed', async () => {
    await accounts.navigateToPage();
    await accounts.changeExistingAddress();
  });
});
