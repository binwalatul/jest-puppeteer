const earnings = require('../../commands');
const userDetail = require('../../utils/existingUsers').users[process.env.NODE_ENV];
const date = new Date();
const earningsData = require('../../customMethods/getAllTimeEarnings');
const selector = require('../selectors/earnings');
const tabUrls = {
  Subscription: '?category=25_a_day',
  Enhanced: '?category=enhanced',
  On_Demand: '?category=on_demand',
  Videos: '?category=video_all',
  SingleAndOthers: '?category=single_image_and_other',
};

const loginAndNavigate = async () => {
  await page.goto(url('/earnings'));
  await earnings.login(userDetail.userWithActiveContent);
  await page.waitForSelector(selector.earningsSummary);
};
const allTimeEarnings = async () => {
  await page.waitForSelector(selector.currentYear);
  const currentMonth = await earnings.getText(selector.currentYear);
  expect(parseInt(currentMonth, 10)).toEqual(date.getFullYear());
  const totalDownloadWeb = await earnings.getText(selector.totalDownloads);
  const totalEarningsWeb = await earnings.getText(selector.totalEarnings);
  const earningSummaryApi = await earningsData(userDetail.userWithActiveContent.ctrbId);
  expect(parseInt(totalDownloadWeb.replace(/[$,]/g, ''), 10)).toEqual(earningSummaryApi.count);
  expect(parseFloat(totalEarningsWeb.replace(/[$,]/g, ''))).toEqual(parseFloat(earningSummaryApi.total));
  const paymentHistoryLink = await earnings.getAttribute(selector.paymentHistoryLink, 'href');
  expect(paymentHistoryLink).toContain(`submit.${ process.env.NODE_ENV }.shutterstock.com/payments`);
};
const viewAllDates = async () => {
  const allDates = await page.$$(selector.totalDates);
  expect(allDates.length).toBeGreaterThanOrEqual(30);
  await page.waitForSelector(selector.showLessDates);
  await page.click(selector.showLessDates);
  await page.waitForSelector(selector.showAllDates);
  await page.waitForSelector(selector.msgOnBottom);
};
const downloadSpreadsheet = async () => {
  await page.waitForSelector(selector.downloadSpreadsheetBtn);
  await page.click(selector.downloadSpreadsheetBtn);
  await page.waitForSelector(selector.spreadSheetModal);
  await page.waitForSelector(selector.startDate);
  await page.waitForSelector(selector.endDate);
  await page.waitForSelector(selector.downloadSpreadsheetBtn);
  await page.waitForSelector(selector.modalCancelBtn);
  await page.click(selector.modalCancelBtn);
  await earnings.waitForElementNotPresent(selector.spreadSheetModal);
};
const navigationTabs = async () => {
  await page.waitForSelector(selector.subscriptionTab);
  await page.click(selector.subscriptionTab);
  expect(await page.url()).toContain(tabUrls.Subscription);
  await page.waitForSelector(selector.enhancedTab);
  await page.click(selector.enhancedTab);
  expect(await page.url()).toContain(tabUrls.Enhanced);
  await page.waitForSelector(selector.onDemandTab);
  await page.click(selector.onDemandTab);
  expect(await page.url()).toContain(tabUrls.On_Demand);
  await page.waitForSelector(selector.videoTab);
  await page.click(selector.videoTab);
  expect(await page.url()).toContain(tabUrls.Videos);
  await page.waitForSelector(selector.singleAndOthersTab);
  await page.click(selector.singleAndOthersTab);
  expect(await page.url()).toContain(tabUrls.SingleAndOthers);
};

module.exports = {
  loginAndNavigate,
  allTimeEarnings,
  viewAllDates,
  downloadSpreadsheet,
  navigationTabs,
};
