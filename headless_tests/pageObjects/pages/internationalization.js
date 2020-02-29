const selector = require('./../selectors/internationalization');
const language = require('../../commands');

const navigateToLOHPAndChangeLang = async (lang, langText) => {
  await page.goto(url('/'));
  await page.waitForSelector(selector.loggedOutVid);
  await page.waitForSelector(selector.langDropdownLohp);
  await page.hover(selector.langDropdownLohp);
  await page.waitForSelector(`span[data-test-ref="language-${ lang }"]>li>span`);
  await page.click(`span[data-test-ref="language-${ lang }"]>li>span`);
  await verifyLang(selector.langName, langText);
};

const loginWithSelectedLang = async (langText) => {
  await page.waitForSelector(selector.headerLoginBtn);
  await page.click(selector.headerLoginBtn);
  await page.waitForSelector(selector.logInBtn);
  expect(await page.url()).toContain(`contributor-accounts.${ process.env.NODE_ENV }.shutterstock.com`);
  await page.waitForSelector(selector.accPageLangName);
  await language.poolUserLogin('signed_up_contributor');
  await verifyLang(selector.langDropdown, langText);
};

const navigateToPagesAndCheckLang = async(langText) => {
  const checkLang = [
    {
      url: '/catalog_manager',
      selector: selector.catManPage,
      langSelector: selector.langDropdown,
    },
    {
      url: '/edit',
      selector: selector.editPage,
      langSelector: selector.langName,
    },
  ];
  for (const check of checkLang) {
    await page.goto(url(check.url));
    await page.waitForSelector(check.selector);
    await page.waitForSelector(check.langSelector);
    await verifyLang(check.langSelector, langText);
  }
};

const verifyLang = async (sel, langText) => {
  await page.waitForSelector(sel);
  const langName = await language.getText(sel);
  expect(langName.trim()).toEqual(langText);
};

const logOut = async() => {
  await page.goto(url('/logout'));
  await page.waitForSelector(selector.loggedOutVid);
  await page.waitForSelector(selector.langDropdownLohp);
};

module.exports = {
  navigateToLOHPAndChangeLang,
  loginWithSelectedLang,
  navigateToPagesAndCheckLang,
  logOut,
};
