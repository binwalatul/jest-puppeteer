const paymentHistory = require('../../commands');
const existingUser = require('../../utils/existingUsers').users[process.env.NODE_ENV].generic;
const selector = require('../selectors/paymentHistory');
const pageHyperLinks = {
  contributorsupport: 'https://www.shutterstock.com/contributorsupport/redirect?l=en&a=000006593',
  account: '/account/settings',
  earnings: '/earnings',
};

const loginAndNavigate = async (userType) => {
  await Promise.all([
    page.goto(url('/payments')),
    (userType === 'pool') ? paymentHistory.poolUserLogin('signed_up_contributor') :
      paymentHistory.login(existingUser),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);
};

const paymentTable = async () => {
  await paymentHistory.waitForElement(selector.paymentTableColumn);
  expect((await page.$$(selector.paymentTableColumn)).length).toBe(8);
  let paginationCount = (await page.$$(selector.paymentTablePagination)).length;
  let numberOfRows = (await page.$$(selector.paymentTableRows)).length;
  if (paginationCount > 1) {
    expect(numberOfRows).toBeLessThanOrEqual(15);
  }
};

const noPaymentHistory = async() => {
  await page.waitForSelector(selector.noPaymentMessage);
  let noPaymentText = await paymentHistory.getText(selector.noPaymentMessageText);
  expect(noPaymentText.trim()).toEqual('No payments have been sent yet.');
  let accountSettingUrl = await paymentHistory.getAttribute(selector.noPaymentMessageHyperLink, 'href');
  expect(accountSettingUrl).toContain(pageHyperLinks.account);
  await paymentHistory.waitForElementNotPresent(selector.alertMsgSection);
};

const alertMsgOnBottom = async () => {
  await page.waitForSelector(selector.alertMsgSection);
  let href = await page.$$(selector.alertMsgSectionHref);
  for (let links of href) {
    let link = await (await links.getProperty('href')).jsonValue();
    expect(link).toContain(pageHyperLinks[link.split('/')[3]]);
  }
};

module.exports = {
  loginAndNavigate,
  paymentTable,
  noPaymentHistory,
  alertMsgOnBottom,
};
