const taxes = require('../../pageObjects/pages/taxes');

describe('Users with expired tax form', () => {
  testWithRetry('User is able to see the expired message on tax page', async () => {
    await taxes.loginAndNavigate({ state: 'expired' });
    await taxes.checkErrorMsg('expired');
  });
});
