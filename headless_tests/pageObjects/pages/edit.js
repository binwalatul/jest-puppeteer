const selector = require('../selectors/edit');
const edit = require('./../../commands');
const testDesc = 'Minimum test description of five words';
const testKeywords = 'one,two,three,four,five,six,seven';
const rejectPendingContent = require('../../customMethods/rejectAllMediaInReview');
let userDetails;

const logInNavigate = async () => {
  await page.goto(url('/edit'));
  userDetails = await edit.poolUserLogin('signed_up_some_data');
  await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 10`, selector.allContentCards);
  await page.waitForSelector(selector.newbieOverlay);
  await page.waitForSelector(selector.newContributorDialogStartBtn);
  await page.click(selector.newContributorDialogStartBtn);
  await edit.waitForElementNotPresent(selector.newbieOverlay);
  await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 10`, selector.allContentCards);
};

const selectMedia = async (from = 0, to = 0) => {
  await page.waitForSelector(selector.contentCheckBox);
  let media = await page.$$(selector.contentCheckBox);
  media.slice(from, to).forEach(async (element) => {
    await element.click();
  });
};


const deleteSelectedMedia = async () => {
  await page.waitForSelector(selector.contentMenuThreeDots);
  await page.click(selector.contentMenuThreeDots);
  await page.waitForSelector(selector.contentMenuDropdown);
  await page.waitForSelector(selector.contentMenuDelete);
  await page.click(selector.contentMenuDelete);
  await page.waitForSelector(selector.confirmDeleteDialog);
  await page.click(selector.contentDeleteConfirmButton);
  await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 9`, selector.allContentCards);
};

const fillUpMediaMetadata = async() => {
  await edit.waitForElement(selector.descriptionTextInput);
  await edit.setValue(selector.descriptionTextInput, testDesc);
  await edit.waitForElement(selector.categoryDropdown);
  await page.click(selector.categoryDropdown);
  await edit.waitForElement(selector.categoryDropdownSection);
  await edit.waitForElement(selector.categoryArts);
  await page.click(selector.categoryArts);
  await edit.setValue(selector.enterKeywords, testKeywords);
  await page.keyboard.press('Enter');
  await page.waitForFunction(keyword => `!!document.querySelectorAll(${ keyword }).length <= 7`, '.o_EditorMain_EditorMain_editorSidebar .o_EditorKeywords_Keyword_filterText');
};

const mediaBatchSubmission = async(mediaBatch) => {
  if (mediaBatch === 'first') {
    await page.click(selector.submitBtn);
    await page.waitForSelector(selector.newbieSubmitOverlay);
    await page.waitForSelector(selector.submitMore);
    await page.waitFor(2000);
    await page.click(selector.submitMore);
    await edit.waitForElementNotPresent(selector.newbieSubmitOverlay);
    await page.waitForSelector(selector.alertMsg);
    await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 6`, selector.allContentCards);
  } else if (mediaBatch === 'second') {
    await page.click(selector.submitBtn);
    await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 3`, selector.allContentCards);
    await page.waitFor(2000);
  }
};

const moveToTab = async(tab) => {
  await page.reload();
  let tabNum;
  if (tab === 'toSubmit') {
    tabNum = 1;
  } else if (tab === 'Pending') {
    tabNum = 2;
  } else if (tab === 'Reviewed') {
    tabNum = 3;
  }
  await page.waitForSelector(`${ selector.navTab }>div:nth-child(${ tabNum })`);
  await page.click(`${ selector.navTab }>div:nth-child(${ tabNum })`, { clickCount: 2 });
  await page.waitForSelector(selector.allContentCards);
  await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 6`, selector.allContentCards);
};

const deletePendingMedia = async() => {
  await page.waitForSelector(selector.deletePendingMedia);
  await page.click(selector.deletePendingMedia);
  await page.waitForSelector(selector.deleteModal);
  await page.waitForSelector(selector.deleteConfirmBtn);
  await page.click(selector.deleteConfirmBtn);
  await page.waitForFunction(content => `!!document.querySelectorAll(${ content }).length === 5`, selector.allContentCards);
};

const addLocation = async(location) => {
  await page.waitForSelector(selector.locationInput);
  await edit.clearValue(selector.locationInput);
  await edit.setValue(selector.locationInput, location);
  await page.waitForSelector(selector.locationSelector);
  await page.keyboard.press('Enter');
}

const rejectPendingMedia = async() => {
  await rejectPendingContent({ ctrbID: userDetails.user.id, domain: 'shutterstock_photo', mediaType: 'photo' });
};

const verifyDescription = async(descriptionText) => {
  const currentText = await edit.getText(selector.descriptionPlaceHolder);
  await expect(currentText).toBe(descriptionText);
};

module.exports = {
  logInNavigate,
  selectMedia,
  deleteSelectedMedia,
  fillUpMediaMetadata,
  mediaBatchSubmission,
  moveToTab,
  deletePendingMedia,
  rejectPendingMedia,
  verifyDescription,
  addLocation,
};
