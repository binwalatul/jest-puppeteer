const accountSetting = require('../../pageObjects/pages/accountSettings');

describe('User is able to change the user setting', () => {
  testWithRetry('User is able to switch to different payment method', async () => {
    await accountSetting.navigateToPage();
    await accountSetting.defaultPaymentMethodAndValue();
    await accountSetting.changePaymentMethod('MISSING');
    await accountSetting.changePaymentMethod('PAYPAL');
    await accountSetting.changePaymentMethod('MONEYBOOKERS');
    await accountSetting.changePaymentMethod('PAYONEER');
  });
});
