const w9Form = require('../../pageObjects/pages/taxes');

describe('User is able to see and submit the w9 form', () => {
  testWithRetry('US user contributing as an Individual is able to see W9 form and submit form.', async () => {
    await w9Form.loginAndNavigate({ user: 'US' });
    await w9Form.questionnaire({ country: 'US', ctrbType: 'INDIVIDUAL' });
    await w9Form.submitW9Form();
  // US user contributing as a Business is able to see and submit the form.'
    await w9Form.submitNewForm();
    await w9Form.questionnaire({ country: 'US', ctrbType: 'BUSINESS' });
    await w9Form.submitW9Form();
  });
});
