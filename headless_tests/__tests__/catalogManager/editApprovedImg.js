const catMan = require('../../pageObjects/pages/catMan');

describe('User is able to edit approved media', () => {
  testWithRetry('User is able to edit approved image', async() => {
    await catMan.loginAndNavigate();
    await catMan.selectMediaTypeTab('Photo');
    await catMan.selectPhotoToEdit();
  });
});
