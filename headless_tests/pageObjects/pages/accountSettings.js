const accountsPage = require('../../commands');
const selectors = require('../selectors/accountSetting');
const title = 'Account Settings | Shutterstock';
const saveMsgExpected = 'Settings saved! Your account settings have been submitted';
const errMsgs = {
  minimumPayoutErr: 'Enter an amount between $35 and $2,000.',
  emailErr: 'Please enter a valid email address.',
};
const minimumAmt = '35';
let userDetails;

const navigateToPage = async () => {
  await page.goto(url('/account/settings'));
  userDetails = await accountsPage.poolUserLogin('signed_up_non_us_contributor');
  await accountsPage.waitForElement(selectors.accountsPage);
  await expect(page.title()).resolves.toMatch(title);
};
const changeLicenseToNo = async () => {
  await accountsPage.waitForElement(selectors.licenseRadioBtn);
  let licenseNo = await page.$$(selectors.licenseContentToNo);
  licenseNo.forEach(async (elem) => {
    await elem.click();
  });
  await page.click(selectors.saveSetting);
  await accountsPage.waitForElement(selectors.saveMessage);
  let saveMsg = await accountsPage.getText(selectors.saveMessage);
  await expect(saveMsg.trim()).toMatch(saveMsgExpected);
};
const checkSelectedLicenseIsStillNo = async() => {
  await page.reload();
  await accountsPage.waitForElement(selectors.licenseRadioBtn);
  let licenseStatus = await page.$$eval(selectors.licenseContentToNo, elem => elem.every((el) => el.checked === true));
  expect(licenseStatus).toBe(true);
};
const userDetailsCheck = async () => {
  await accountsPage.waitForElement(selectors.userEmail);
  let userEmail = await accountsPage.getText(selectors.userEmail);
  await expect(userEmail).toMatch(userDetails.user.email);
  await accountsPage.waitForElement(selectors.payToName);
  let userName = await accountsPage.getText(selectors.payToName);
  await expect(userName).toEqual(userDetails.user.full_name);
  await accountsPage.waitForElement(selectors.payoutEmail);
  let payToEmail = await accountsPage.getAttribute(selectors.payoutEmail, 'value');
  await expect(payToEmail).toEqual(userDetails.user.email);
};
const defaultPaymentMethodAndValue = async () => {
  await accountsPage.waitForElement(selectors.paymentMethod);
  let paymentType = await accountsPage.getText(selectors.selectedPayout);
  await expect(paymentType.trim()).toEqual('None selected');
  let minimumPayment = await accountsPage.getAttribute(selectors.minimum_payout_field, 'value');
  await expect(minimumPayment).toEqual(minimumAmt);
  await checkErrMsg();
};
const checkErrMsg = async () => {
  await accountsPage.clearValue(selectors.minimum_payout_field);
  await accountsPage.waitForElement(selectors.minimum_payout_error);
  let errMsgPayout = await accountsPage.getText(selectors.minimum_payout_error);
  await expect(errMsgPayout).toEqual(errMsgs.minimumPayoutErr);
  await accountsPage.clearValue(selectors.payout_email_field);
  await accountsPage.waitForElement(selectors.payout_email_error);
  let errMsgEmail = await accountsPage.getText(selectors.payout_email_error);
  await expect(errMsgEmail.trim()).toEqual(errMsgs.emailErr);
  await accountsPage.setValue(selectors.payoutEmail, userDetails.user.email);
  await accountsPage.setValue(selectors.minimum_payout_field, minimumAmt);
  await page.click(selectors.saveSetting);
  await accountsPage.waitForElement(selectors.saveMessage);
};
const changePaymentMethod = async (payMethod) => {
  await accountsPage.waitForElement(selectors.payoutType);
  await page.select(selectors.payoutType, `${ payMethod }`);
  if (payMethod === 'PAYPAL' || payMethod === 'MONEYBOOKERS') {
    await accountsPage.waitForElement(selectors.saveSetting);
    await page.click(selectors.saveSetting);
    await accountsPage.waitForElement(selectors.payoutModal);
    await page.click(selectors.payoutModalSave);
    await accountsPage.waitForElement(selectors.saveMessage);
    let saveMsg = await accountsPage.getText(selectors.saveMessage);
    await expect(saveMsg.trim()).toMatch(saveMsgExpected);
    await checkErrMsg();
  } else if (payMethod === 'MISSING') {
    await accountsPage.waitForElement(selectors.saveSetting);
    await page.click(selectors.saveSetting);
    await accountsPage.waitForElement(selectors.saveMessage);
    let saveMsg = await accountsPage.getText(selectors.saveMessage);
    await expect(saveMsg.trim()).toMatch(saveMsgExpected);
    await checkErrMsg();
  } else if (payMethod === 'PAYONEER') {
    await accountsPage.waitForElement(selectors.payoneerConnectBtn);
  }
};

module.exports = {
  navigateToPage,
  changeLicenseToNo,
  checkSelectedLicenseIsStillNo,
  userDetailsCheck,
  changePaymentMethod,
  defaultPaymentMethodAndValue,
};
