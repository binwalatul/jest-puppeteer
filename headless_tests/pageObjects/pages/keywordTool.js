const keywordTool = require('./../../commands');
const selector = require('./../selectors/keywordTool');
const keywordList = [];
let keywords = 0;

const logInAndNavigate = async () => {
  await page.goto(url('/edit'));
  await keywordTool.poolUserLogin('signed_up_some_data');
  await page.waitForSelector(selector.toSubmitImages);
  await page.waitForSelector(selector.newbieOverlay);
  await page.waitForSelector(selector.newContributorDialogStartBtn);
  await page.click(selector.newContributorDialogStartBtn);
  await keywordTool.waitForElementNotPresent(selector.newbieOverlay);
};

const openKeywordTool = async () => {
  await page.waitForSelector(selector.keywordTool);
  await page.click(selector.keywordTool);
  await page.waitForSelector(selector.keywordToolBody);
  await keywordTool.clearValue(selector.search);
  await keywordTool.setValue(selector.search, 'lake');
  await page.click(selector.searchBtn);
  await page.waitForSelector(selector.searchResult);
  const selectImg = await page.$$(selector.resultCheckbox);
  selectImg.slice(0, 3).forEach(async (elem) => {
    await elem.click();
  });
  await page.waitForSelector(selector.addSuggestedKeywords);
  await page.click(selector.addSuggestedKeywords);
};

const extractKeywords = async (action) => {
  await page.waitForSelector(selector.addedKeywordPills);
  keywords = await page.$$(selector.addedKeywordPills);
  expect(keywords.length).toBeGreaterThan(0);
  for (const key of keywords) {
    keywordList.push(await page.evaluate(elem => elem.textContent, key));
  }
  if (action === 'copy') {
    await page.click(selector.copyKeyword);
    await clearKeywordsOnTool();
  } else {
    await page.click(selector.keywordToolAttachBtn);
  }
};

const keyWordMenu = async(func) => {
  await page.waitForSelector(selector.keywordContainerEditPage);
  await page.click(selector.keywordContainerOptions);
  await page.waitForSelector(selector.keywordMenu);
  await page.waitForSelector(`${ selector.editPage } span[data-test-ref="keywords-menu-${ func }"]>li>span`);
  await page.click(`${ selector.editPage } span[data-test-ref="keywords-menu-${ func }"]>li>span`);
};

const verifyCopiedKeywords = async(action) => {
  await page.click(selector.keywordToolCloseBtn);
  if (action === 'copy') {
    await selectUploadedMedia();
    await keyWordMenu('clear');
    await keyWordMenu('paste');
  }
  let copiedKeywords = await page.$$(selector.editKeywordPills);
  expect(copiedKeywords.length).toBe(keywords.length);
  await keyWordMenu('clear');
  await page.click(selector.editSaveBtn);
  await page.waitFor(2000);
};
const clearKeywordsOnTool = async() => {
  await page.waitForSelector(selector.clearKeywordsTool);
  await page.click(selector.clearKeywordsTool);
  await page.$$(selector.addedKeywordPills);
  let keywordCount = await page.$$(selector.addedKeywordPills);
  expect(keywordCount.length).toBe(0);
};
const selectUploadedMedia = async () => {
  await page.waitForSelector(selector.toSubmitImages);
  await page.click(selector.toSubmitImagesCheckBox);
};

module.exports = {
  logInAndNavigate,
  openKeywordTool,
  extractKeywords,
  verifyCopiedKeywords,
};
