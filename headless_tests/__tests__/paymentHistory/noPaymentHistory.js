const payment = require('../../pageObjects/pages/paymentHistory');

describe('No payment history', () => {
  testWithRetry('should see the no payments have been sent yet message', async() => {
    await payment.loginAndNavigate('pool');
    await payment.noPaymentHistory();
  });
});
