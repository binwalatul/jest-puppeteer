const catMan = require('./../../pageObjects/pages/catMan');

describe('User is able to perform actions on image sets', () => {
  testWithRetry('User is able to perform actions on set containing vectors', async () => {
    await catMan.loginAndNavigate();
    await catMan.selectMediaTypeTab('Vector');
    await catMan.selectAndAddMediaToNewSet();
    await catMan.renameSet();
    await catMan.unpublishSet();
    await catMan.deleteSets();
  });
});
