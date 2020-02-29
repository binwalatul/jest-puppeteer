const catMan = require('./../../pageObjects/pages/catMan');

describe('User is able to perform actions on footage sets', () => {
  testWithRetry('User is able to perform actions on set containing Videos', async () => {
    await catMan.loginAndNavigate();
    await catMan.selectMediaTypeTab('Video');
    await catMan.selectAndAddMediaToNewSet();
    await catMan.renameSet();
    await catMan.deleteSets();
  });
});
