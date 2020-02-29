const taxes = require('../../commands');
const moment = require('moment');
const currentDate = moment().format('MM-DD-YYYY');
const selector = require('../selectors/taxes');
const existingUsers = require('../../utils/existingUsers').users[process.env.NODE_ENV];
const SSN = '984253452';
let userName;

const loginAndNavigate = async (opts) => {
  await page.goto(url('/legal/taxes/'));
  if (opts.user) {
    let poolUser = (opts.user === 'US') ? 'signed_up_contributor' : 'signed_up_non_us_contributor';
    userName = await taxes.poolUserLogin(poolUser);
    await page.waitForSelector(selector.questionnaire);
  }
  if (opts.state) {
    let formStatus = (opts.state === 'rejected') ? 'TaxForm_Rejected' : 'TaxForm_Expired';
    await taxes.login(existingUsers[formStatus]);
  }
};

// @ctrbType : INDIVIDUAL or BUSINESS
const questionnaire = async (opts) => {
  let entity = (opts.country === 'US') ? 'US_ENTITY' : 'FOREIGN_ENTITY';
  await page.waitForSelector(`input[value="${ entity }"]`);
  await page.click(`input[value="${ entity }"]`);
  await page.waitForSelector(`input[value = "${ opts.ctrbType }"]`);
  await page.click(`input[value = "${ opts.ctrbType }"]`);
  if (opts.country !== 'US' && opts.ctrbType === 'BUSINESS') {
    await taxes.waitForElement(selector.taxQuestion3);
    await page.waitForSelector(selector.yesBtn);
    await page.click(selector.yesBtn);
  }
  await page.click(selector.submitBtn);
};

const submitW9Form = async () => {
  await page.waitForSelector(selector.w9TaxForm);
  let payeeName = await taxes.getAttribute(selector.w9PayeeName, 'value');
  expect(payeeName).toMatch(userName.user.full_name);
  await page.waitForSelector(selector.w9Individual);
  await page.click(selector.w9Individual);
  await taxes.waitForElement(selector.w9SSN);
  await taxes.setValue(selector.w9SSN, SSN);
  await page.click(selector.submitBtn);
  await page.waitForSelector(selector.w9TaxForm);
  await taxes.setValue(selector.eSignature, userName.user.full_name);
  await taxes.setValue(selector.w9SignDate, currentDate);
  await page.click(selector.submitBtn);
  await page.waitForSelector(selector.formApproval);
};

const submitNewForm = async () => {
  await page.waitForSelector(selector.submitNewForm);
  await page.click(selector.submitNewForm);
  await page.waitForSelector(selector.questionnaire);
};

/**
 * Use 'fr' for existing country code to get approved form
 * and other country code for pending state.
 *  */
const submitW8Form = async (country) => {
  await page.waitForSelector(selector.w8Form);
  let heading = await taxes.getText(selector.w8Form);
  expect(heading.trim()).toMatch('Please complete form W-8BEN');
  let payeeName = await taxes.getAttribute(selector.w8PayeeName, 'value');
  expect(payeeName).toMatch(userName.user.full_name);
  await page.select(selector.w8Citizenship, `${ country }`);
  await page.waitForSelector(selector.w8ResidentialPOBoxNo);
  await page.click(selector.w8ResidentialPOBoxNo);
  await page.click(selector.w8SSN);
  await taxes.waitForElement(selector.w8SsnNumber);
  await taxes.setValue(selector.w8SsnNumber, SSN);
  await taxes.setValue(selector.w8PayeeBirthday, currentDate);
  await page.click(selector.w8PayeeName);
  await taxes.waitForElement(selector.w8Under18ErrMsg);
  await taxes.clearValue(selector.w8PayeeBirthday);
  await taxes.setValue(selector.w8PayeeBirthday, '06/03/1993');
  await page.click(selector.w8PayeeName);
  await taxes.waitForElementNotPresent(selector.w8Under18ErrMsg);
  await page.select(selector.w8PayeeCountry, `${ country }`);
  await page.click(selector.submitBtn);
  await page.waitForSelector(selector.w8Preview);
  await page.waitForSelector(selector.eSignature);
  await taxes.setValue(selector.eSignature, userName.user.full_name);
  await page.click(selector.submitBtn);
  if (country !== 'fr') {
    await page.waitForSelector(selector.formPending);
  } else {
    await taxes.waitForElement(selector.formApproval);
  }
};

const NonUsAndBusiness = async () => {
  await page.waitForSelector(selector.otherTaxForms);
};

const checkErrorMsg = async (errMsg) => {
  let msgSel = (errMsg === 'rejected') ? selector.formRejected : selector.formExpired;
  let msg = (errMsg === 'rejected') ? 'Your form has been rejected.' : 'Time to resubmit your tax form!';
  let err = await taxes.getText(`${ msgSel }`);
  expect(err.trim()).toContain(`${ msg }`);
};

module.exports = {
  loginAndNavigate,
  questionnaire,
  submitW9Form,
  submitNewForm,
  submitW8Form,
  NonUsAndBusiness,
  checkErrorMsg,
};
