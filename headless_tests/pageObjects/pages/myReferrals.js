const myReferrals = require('../../commands');
const user = require('../../utils/existingUsers').users[process.env.NODE_ENV];
const contributorReferralData = require('../../customMethods/getContributorReferralData');
const allTimeReferralData = require('../../customMethods/getAllTimeReferralData');
const selector = require('../selectors/myReferrals');
const environment = (process.env.NODE_ENV === 'qa') ? 'qa' : 'integration.dev';

const loginAndNavigate = async () => {
  await page.goto(url('/referrals'));
  await myReferrals.login(user.generic);
  await page.waitForSelector(selector.heading);
  await page.waitForSelector(selector.referralCtrbSection);
  await page.waitForSelector(selector.referralCustomerSection);
};

const checkTotalReferralSummary = async () => {
  await myReferrals.waitForElement(selector.totalReferralEarnings);
  let totalReferralData = await allTimeReferralData(user.generic.global_id);
  let totalEarningsWeb = await myReferrals.getText(selector.totalReferralEarnings);
  expect(parseFloat(totalReferralData.earnings.total).toFixed(2)).toEqual(totalEarningsWeb.replace('$', ''));
  await page.waitForSelector(selector.totalCtrbEarnings);
  let totalCtrbEarnings = await myReferrals.getText(selector.totalCtrbEarnings);
  expect(parseFloat(totalReferralData.earnings.contributor).toFixed(2)).toEqual(totalCtrbEarnings.replace('$', ''));
  await page.waitForSelector(selector.totalCustomerEarnings);
  let totalCustomerEarning = await myReferrals.getText(selector.totalCustomerEarnings);
  expect(parseFloat(totalReferralData.earnings.customer).toFixed(2)).toEqual(totalCustomerEarning.replace('$', ''));
  await page.waitForSelector(selector.totalReferralCount);
  let totalReferrals = await myReferrals.getText(selector.totalReferralCount);
  expect(totalReferralData.referrals.total).toEqual(parseInt(totalReferrals, 10));
  await page.waitForSelector(selector.totalContributorCount);
  let totalReferralContributor = await myReferrals.getText(selector.totalContributorCount);
  expect(totalReferralData.referrals.contributor).toEqual(parseInt(totalReferralContributor, 10));
  await page.waitForSelector(selector.totalCustomerCount);
  let totalReferralCustomer = await myReferrals.getText(selector.totalCustomerCount);
  expect(totalReferralData.referrals.customer).toEqual(parseInt(totalReferralCustomer, 10));
};

const referredContributorUrl = async () => {
  await page.waitForSelector(selector.firstReferredCtrb);
  let referredContriName = await myReferrals.getText(selector.firstReferredCtrb);
  let referredContributor = await myReferrals.getAttribute(selector.firstReferredCtrb, 'href');
  expect(referredContributor).toContain(`https://www.${ environment }.shutterstock.com/g/${ (referredContriName).replace(/ /g, '+') }`);
};

const verifyreferralCtrb = async () => {
  const names = await referredCtrbNamesWeb();
  const namesAPI = await referredCtrbNamesAPI();
  expect(names).toEqual(namesAPI);
};

const referredCtrbNamesWeb = async () => {
  let contributorNames = [];
  await page.waitForSelector(selector.referredCtrbName);
  let referredCtrb = await page.$$(selector.referredCtrbName);
  for (const option of referredCtrb) {
    const label = await page.evaluate(el => el.innerText, option);
    contributorNames.push(label);
  }
  return contributorNames;
};

const referredCtrbNamesAPI = async () => {
  let ctrbNames = [];
  let namesAPI = await contributorReferralData(user.generic.global_id);
  let referredCtrb = namesAPI.data;
  for (ctrbName of referredCtrb) {
    ctrbNames.push(ctrbName.display_name);
  }
  return ctrbNames;
};

const howItWorks = async () => {
  await page.waitForSelector(selector.referralShareLink);
  let referralUrl = await myReferrals.getText(selector.referralShareLink);
  expect(referralUrl).toContain(`http://submit.${ environment }.shutterstock.com?rid=${ user.generic.ctrbId }`);
  await page.waitForSelector(selector.galleryUrl);
  let imgGalleryPage = await myReferrals.getText(selector.galleryUrl);
  expect(imgGalleryPage).toContain(`http://www.${ environment }.shutterstock.com/g/ui?rid=${ user.generic.ctrbId }`);
};

module.exports = {
  loginAndNavigate,
  checkTotalReferralSummary,
  referredContributorUrl,
  verifyreferralCtrb,
  howItWorks,
};
