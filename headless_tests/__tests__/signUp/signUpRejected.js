const signUp = require('../../pageObjects/pages/signUp');

describe('Users rejected by sift check are not able to navigate to the dashboard page', () => {
  testWithRetry('User failed the sift check', async () => {
    await signUp.signUpUser('basic_rejected');
    await signUp.signUpAddress();
    await signUp.siftCheck();
  });
});
