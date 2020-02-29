const signUp = require('../../pageObjects/pages/signUp');

describe('Users accepted by sift check are able to navigate to the dashboard page', () => {
  testWithRetry('User pass the sift check', async () => {
    await signUp.signUpUser('signed_up_no_address');
    await signUp.signUpAddress();
    await signUp.siftCheck();
  });
});
