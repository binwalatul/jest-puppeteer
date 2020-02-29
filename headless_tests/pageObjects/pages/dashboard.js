const dashboard = require('../../commands');
const selector = require('../selectors/dashboard');
const existingUser = require('../../utils/existingUsers').users[process.env.NODE_ENV].generic;
const summaryApi = require('../../customMethods/getContentStatus');
const unpaidEarningApi = require('../../customMethods/getUnpaidEarnings');
const earningSummaryApi = require('../../customMethods/getAllTimeEarnings');
const topPerfApi = require('../../customMethods/getTopPerf');
const pageUrls = {
  imgUpload: '/upload/portfolio',
  portfolioImg: `/g/ui?rid=${ existingUser.ctrbId }`,
  portfolioVid: `/g/ui/video?rid=${ existingUser.ctrbId }`,
  unpaidSecLearnMore: '/contributorsupport/redirect',
  addResourcesViewMore: 'http://www.shutterstock.com/blog/category/contributors',
};

const loginAndNavigate = async (userType) => {
  await page.goto(url('/dashboard'));
  await Promise.all([
    (userType === 'pool') ? dashboard.poolUserLogin('signed_up_contributor') :
      dashboard.login(existingUser),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.waitForSelector(selector.dashboard),
  ]);
};

const uploadHrefs = async () => {
  await page.waitForSelector(selector.uploadImgBtn);
  let imgUploadUrl = await dashboard.getAttribute(selector.uploadImgBtn, 'href');
  expect(imgUploadUrl).toMatch(pageUrls.imgUpload);
  await page.waitForSelector(selector.uploadDropdownBtn);
  await page.click(selector.uploadDropdownBtn);
  await page.waitForSelector(selector.uploadVidBtn);
};

const contentOverview = async (mediaType) => {
  let media = (mediaType === 'image') ? 'images' : 'videos';
  await page.waitForSelector(`#${ media }-tab`);
  await page.click(`#${ media }-tab`);
  let defaultLinks = await page.$$(`#content-status-${ media }>div>a`);
  expect(defaultLinks.length).toEqual(4);
  let notYetSubmitted = await dashboard.getAttribute(`#not-yet-submitted-${ media }`, 'href');
  expect(notYetSubmitted).toContain('/edit');
  let pendingApproval = await dashboard.getAttribute(`#pending-approval-${ media }`, 'href');
  expect(pendingApproval).toContain('/pending');
  let recentlyReviewed = await dashboard.getAttribute(`#reviewed-${ media }`, 'href');
  expect(recentlyReviewed).toContain('/reviewed');
  let portfolio = await dashboard.getAttribute(`#gallery-${ media }`, 'href');
  let portfolioUrl = (mediaType === 'image') ? pageUrls.portfolioImg : pageUrls.portfolioVid;
  expect(portfolio).toContain(portfolioUrl);
  let mediaThumbs = await page.$$(`#content-status-${ media } > ${ selector.contentStatusThumb }`);
  expect(mediaThumbs.length).toBeGreaterThan(1);
};

const contentOverviewCount = async (mediaType) => {
  let media = (mediaType === 'image') ? 'images' : 'videos';
  let mediaCountAPI = await summaryApi(existingUser.global_id);
  await page.waitForSelector(`#${ media }-tab`);
  const {
    pending_submission: pendingSubmission,
    pending_approval: pendingApproval,
    recently_reviewed: recentlyReviewed,
  } = mediaCountAPI[media];
  let notYetSubmittedCount = await dashboard.getText(`#not-yet-submitted-${ media }>span`);
  expect(parseInt(notYetSubmittedCount, 10)).toEqual(pendingSubmission);
  let pendingApprovalCount = await dashboard.getText(`#pending-approval-${ media }>span`);
  expect(parseInt(pendingApprovalCount, 10)).toEqual(pendingApproval);
  let recentlyReviewedCount = await dashboard.getText(`#reviewed-${ media }>span`);
  expect(parseInt(recentlyReviewedCount, 10)).toEqual(recentlyReviewed);
};

const unpaidEarningsOverview = async () => {
  let unpaidEar = await unpaidEarningApi(existingUser.global_id);
  await page.waitForSelector(selector.unpaidEarningsSection);
  await page.waitForSelector(selector.unpaidEarningsTitle);
  let sectionHeading = await dashboard.getText(selector.unpaidEarningsTitle);
  expect(sectionHeading.trim()).toEqual('Unpaid Earnings*');
  let unpaidEarnings = await dashboard.getText(selector.unpaidEarnings);
  expect(parseFloat(unpaidEarnings.replace(/[$,]/g, '')).toFixed(2)).toEqual(parseFloat(unpaidEar.unpaid.total).toFixed(2));
  let learnMoreUrl = await dashboard.getAttribute(selector.learnMore, 'href');
  expect(learnMoreUrl).toContain(pageUrls.unpaidSecLearnMore);
};

const earningsSummaryOverview = async () => {
  let mediaType = ['all', 'photo', 'video'];
  await page.waitForSelector(selector.earningsSummaryContainer);
  for (const media of mediaType) {
    await page.waitForSelector(selector.earningsOfMediaType);
    let mediaContentType = (media === 'all') ? null : media;
    let apiEarnings = await earningSummaryApi(existingUser.global_id, mediaContentType);
    await page.select(selector.earningsOfMediaType, media);
    await page.waitForSelector(selector.totalEarnings);
    let earnings = await dashboard.getText(selector.totalEarnings);
    expect(parseFloat(earnings.replace(/[$,]/g, '')).toFixed(2)).toEqual(parseFloat(apiEarnings.total).toFixed(2));
    let downloadCount = await dashboard.getText(selector.totalDownloads);
    expect(parseInt(downloadCount.replace(/[,]/g, ''), 10)).toEqual(apiEarnings.count);
  }
  await page.waitForSelector(selector.earningSummaryGraphSection);
};

const additionalResourceSection = async() => {
  await page.waitForSelector(selector.addResources);
  let sectionTitle = await dashboard.getText(selector.addResources);
  expect(sectionTitle.trim()).toEqual('Additional resources');
  await page.waitForSelector(selector.resourcesHyperlink);
  let blogPostCount = await page.$$(selector.resourcesHyperlink);
  expect(blogPostCount.length).toBeGreaterThanOrEqual(3);
  let viewMoreHyperLink = await dashboard.getAttribute(selector.resourcesViewMore, 'href');
  expect(viewMoreHyperLink).toMatch(pageUrls.addResourcesViewMore);
};

const announcementSection = async () => {
  await page.waitForSelector(selector.announcementTitle);
  let sectionTitle = await dashboard.getText(selector.announcementTitle);
  expect(sectionTitle.trim()).toEqual('Announcements');
  await page.waitForSelector(selector.announcementHyperlinks);
  let announcementLinkCount = await page.$$(selector.announcementHyperlinks);
  expect(announcementLinkCount.length).toBeGreaterThanOrEqual(3);
  await page.waitForSelector(selector.announcementTime);
  let announcementTime = await page.$$(selector.announcementHyperlinks);
  expect(announcementTime.length).toBeGreaterThanOrEqual(3);
};

const setsOverview = async (mediaType) => {
  let selectedSets = await page.$$(selector.selectedSetsOnDashboard);
  if (selectedSets.length >= 1) {
    await clearSetsFromDashboard();
  }
  let media = (mediaType === 'image') ? { type: 'image', setId: '16759849' } : { type: 'video', setId: '36388207' };
  await page.waitForSelector(selector.setOverview);
  await page.waitForSelector(selector.addSet);
  await page.click(selector.addSet);
  await page.waitForSelector(selector.addSetsModal);
  await page.select(selector.setTypeOnModal, media.type);
  await page.select(selector.selectSetOnModal, media.setId);
  await page.waitForSelector(selector.clearSetBtn);
  await page.click(selector.applyBtn);
  await dashboard.waitForElementNotPresent(selector.addSetsModal);
  await page.waitForSelector(selector.selectedSetsOnDashboard);
  await page.click(selector.selectSets);
  await page.waitForSelector(selector.addSetsModal);
  await page.waitForSelector(selector.clearSetBtn);
  await page.click(selector.clearSetBtn);
  let setSelector = await page.$$(selector.setTypeOnModal);
  expect(setSelector.length).toBe(1);
  await page.click(selector.applyBtn);
  await dashboard.waitForElementNotPresent(selector.addSetsModal);
  await dashboard.waitForElementNotPresent(selector.selectedSetsOnDashboard);
};

const clearSetsFromDashboard = async () => {
  await page.click(selector.selectSets);
  await page.waitForSelector(selector.addSetsModal);
  await dashboard.waitForElement(selector.clearSetBtn);
  let sets = await page.$$(selector.clearSetBtn);
  while (sets.length > 0) {
    await page.waitForSelector(selector.clearSetBtn);
    await page.click(selector.clearSetBtn);
    if ((await page.$$(selector.clearSetBtn)).length === 0) {
      break;
    }
  }
  await page.click(selector.applyBtn);
  await dashboard.waitForElementNotPresent(selector.addSetsModal);
  await dashboard.waitForElementNotPresent(selector.selectedSetsOnDashboard);
};

const topPerfOverview = async () => {
  let earnings = [];
  await page.waitForSelector(selector.topPerfContainer);
  let topPerf = await topPerfApi(existingUser.global_id);
  let topPerfUi = await page.$$(selector.topPerfEarnings);
  for (const topPerfArr of topPerfUi) {
    earnings.push(await (await page.evaluate(elem => elem.textContent, topPerfArr)).replace(/[$,]/g, ''));
  }
  let topPerfApiArr = topPerf.media.map((total) => {
    return (parseFloat(total.total)).toFixed(2);
  });
  expect(earnings).toEqual(topPerfApiArr);
};

module.exports = {
  loginAndNavigate,
  uploadHrefs,
  contentOverview,
  contentOverviewCount,
  unpaidEarningsOverview,
  earningsSummaryOverview,
  additionalResourceSection,
  announcementSection,
  topPerfOverview,
  setsOverview,
};
