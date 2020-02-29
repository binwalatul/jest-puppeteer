const payment = require('../../pageObjects/pages/paymentHistory');

describe('Payment history page', () => {
  testWithRetry('should show the payment history table', async () => {
    await payment.loginAndNavigate();
    await payment.paymentTable();
    await payment.alertMsgOnBottom();
  });
});
