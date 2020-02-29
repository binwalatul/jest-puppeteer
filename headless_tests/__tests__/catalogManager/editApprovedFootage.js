const catMan = require('./../../pageObjects/pages/catMan');

describe('User is able to edit approved media', () => {
  testWithRetry('User is able to edit the approved footage content', async () => {
    await catMan.loginAndNavigate();
    await catMan.selectMediaTypeTab('Video');
    await catMan.selectVideoToEdit();
  });
});
