const pageLang = require('../../pageObjects/pages/internationalization');
const languages = [
  {
    langCode: 'ru',
    lang: 'Русский',
  },
  {
    langCode: 'it',
    lang: 'Italiano',
  },
  {
    langCode: 'zh',
    lang: '简体中文',
  },
  {
    langCode: 'zh-Hant',
    lang: '繁體中文',
  },
];

describe('Language should stick on moving to other pages', () => {
  for (const language of languages) {
    testWithRetry(`should see ${ language.lang } language on navigating to other pages`, async () => {
      await pageLang.navigateToLOHPAndChangeLang(language.langCode, language.lang);
      await pageLang.loginWithSelectedLang(language.lang);
      await pageLang.navigateToPagesAndCheckLang(language.lang);
      await pageLang.logOut();
    });
  }
});
