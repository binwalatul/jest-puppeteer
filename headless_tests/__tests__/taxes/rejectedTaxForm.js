const taxes = require('../../pageObjects/pages/taxes');

describe('Users with rejected tax form', () => {
  testWithRetry('User is able to see the rejected message on tax page', async () => {
    await taxes.loginAndNavigate({ state: 'rejected' });
    await taxes.checkErrorMsg('rejected');
  });
});
