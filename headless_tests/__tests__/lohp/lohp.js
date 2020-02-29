const lohp = require('./../../pageObjects/pages/lohp');

describe('User is able to see the expected text on logged out page', () => {
  testWithRetry('User is seeing expected texts and urls on the page', async () => {
    await lohp.impHyperLinks();
    await lohp.copyCheck();
  });
});
