const catMan = require('./../../pageObjects/pages/catMan');

describe('User is able to perform actions on catalog manager', () => {
  testWithRetry('User is able to see the right count on every media type', async () => {
    await catMan.loginAndNavigate();
    await catMan.mediaDataCountIsCorrect('Catalog');
    await catMan.mediaDataCountIsCorrect('Photo');
    await catMan.mediaDataCountIsCorrect('Vector');
    await catMan.mediaDataCountIsCorrect('Video');
    await catMan.deleteSets();
  });
});
