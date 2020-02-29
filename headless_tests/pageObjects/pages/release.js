const release = require('../../commands');
const selector = require('../selectors/release');
let releaseDetails = null;
let newReleaseDetails = null;
const emptyStateMsg = 'You don\'t have any active releases.';

const loginAndNavigate = async () => {
  await page.goto(url('/releases'));
  await release.poolUserLogin('signed_up_contributor');
  await page.waitForFunction(releases => `!!document.querySelectorAll(${ releases }).length`, selector.release);
  releaseDetails = await release.getText(selector.releaseDetails);
};

const previewRelease = async () => {
  await page.waitForSelector(selector.viewRelease);
  const releasePreviewPage = await release.clickAndWaitForTarget(selector.viewRelease, page, browser);
  expect(releasePreviewPage.url()).toContain('download');
};

const checkEmptyState = async () => {
  await page.waitForSelector(selector.emptyStateMsg);
  const emptyMsg = await release.getText(selector.emptyStateMsg);
  expect(emptyMsg.trim()).toMatch(emptyStateMsg);
};

const editRelease = async (tab) => {
  if (tab === 'ethnicity') {
    await page.waitForSelector(selector.editRelease);
    await page.click(selector.editRelease);
    await page.waitForSelector(selector.editReleaseModal);
  }
  await page.waitForSelector(`[data-test-ref="${ tab }-dropdown"] .o_Dropdown_Dropdown_field`);
  await page.waitForSelector(`[data-test-ref="${ tab }-dropdown"] ul>li:nth-child(2)`);
  await page.click(`[data-test-ref="${ tab }-dropdown"] ul>li:nth-child(2)`);
  if (tab === 'gender') {
    await page.click(selector.activeArchiveBtn);
    await release.waitForElementNotPresent(selector.editReleaseModal);
    await release.waitForElementNotPresent(selector.viewRelease);
  }
};

const moveTo = async (nav) => {
  if (nav === 'Active') {
    nav = 1;
  } else if (nav === 'Archived') {
    nav = 2;
  }
  await page.click(`.o_tabs_theme_navigation div:nth-child(${ nav })`);
  await page.waitForSelector(selector.releaseDetails);
  newReleaseDetails = await release.getText(selector.releaseDetails);
};

const checkUpdatedDetails = async () => {
  await expect(releaseDetails).not.toEqual(newReleaseDetails);
};

const moveReleaseToActive = async () => {
  await page.waitForSelector(selector.editRelease);
  await page.click(selector.editRelease);
  await page.waitForSelector(selector.editReleaseModal);
  await page.click(selector.activeArchiveBtn);
  await release.waitForElementNotPresent(selector.editReleaseModal);
  await release.waitForElementNotPresent(selector.viewRelease);
};

module.exports = {
  loginAndNavigate,
  previewRelease,
  editRelease,
  checkEmptyState,
  moveTo,
  checkUpdatedDetails,
  moveReleaseToActive,
};
