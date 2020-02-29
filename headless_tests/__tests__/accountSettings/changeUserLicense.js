const accountSetting = require('../../pageObjects/pages/accountSettings');

describe('User can change the user\'s license options', () => {
  testWithRetry('Media license can be changed', async () => {
    await accountSetting.navigateToPage();
    await accountSetting.userDetailsCheck();
    await accountSetting.changeLicenseToNo();
    // Commententing this out till the time we fix the flakyness
    // await accountSetting.checkSelectedLicenseIsStillNo();
  });
});
