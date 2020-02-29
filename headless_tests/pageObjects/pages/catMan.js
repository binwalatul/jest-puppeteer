const catMan = require('./../../commands');
const selector = require('../selectors/catMan');
const random = require('randomstring');
const testSetName = `testset ${ random.generate(3) }`;
const testDesc = `New five word description ${ random.generate(3) } `;
const user = require('./../../utils/existingUsers').users[process.env.NODE_ENV];

const loginAndNavigate = async () => {
  await page.goto(url('/catalog_manager'));
  await catMan.login(user.userWithActiveContent);
  await catMan.waitForElement(selector.media);
};

const mediaDataCountIsCorrect = async (mediaType) => {
  await selectMediaTypeTab(mediaType);
  await catMan.waitForElement(selector.media);
  const allMediaCount = await catMan.getText(`li[data-test-ref="${ mediaType }"]>span:last-child`);
  const actualMediaCount = await page.$$(selector.media);
  expect(allMediaCount).toMatch((actualMediaCount.length).toString());
};

const selectMediaTypeTab = async (mediaType) => {
  await catMan.waitForElement(`li[data-test-ref="${ mediaType }"]>span:last-child`);
  await page.click(`li[data-test-ref="${ mediaType }"]>span:last-child`);
};

const selectAndAddMediaToNewSet = async () => {
  await page.waitForFunction(checkbox => `document.querySelectorAll(${ checkbox }).length > 0`, selector.mediaSelectCheckbox);
  await catMan.waitForElement(selector.mediaSelectCheckbox);
  const mediaSelectCheckboxes = await page.$$(selector.mediaSelectCheckbox);
  (mediaSelectCheckboxes).slice(0, 2).forEach(async elem => {
    await elem.click();
  });
  await page.click(selector.createSetBtn);
  await catMan.waitForElement(selector.setActionConfirmDialog);
  await catMan.setValue(selector.enterSetName, testSetName);
  await page.click(selector.confirmCreateSet);
};

const deleteSets = async () => {
  await page.waitForFunction(sets => `document.querySelectorAll(${ sets }) != null`, selector.createdSets);
  const sets = await page.$$(selector.createdSets);
  for (let set of sets) {
    await set.click();
    await setAction('delete-set');
    await catMan.waitForElement(selector.setActionConfirmDialog);
    await page.click(selector.confirmDeleteSet);
  }
};
// valid params: toggle-publish-set, rename-set, delete-set
const setAction = async (action) => {
  await catMan.waitForElement(selector.setActions);
  await page.click(selector.setActions);
  await catMan.waitForElement(selector.setActionsDropdown);
  await catMan.waitForElement(`span[data-test-ref="${ action }"]`);
  await page.click(`span[data-test-ref="${ action }"]`);
};

const unpublishSet = async () => {
  await page.waitForFunction(sel => `document.querySelector("${ sel }").style.visibility === "visible"`, selector.publishSign);
  await page.click(selector.publishSign);
  await setAction('toggle-publish-set');
  await page.waitForFunction(`document.querySelector("${ selector.publishSign }").style.visibility === "visible"`);
};

const renameSet = async () => {
  await catMan.waitForElement(selector.createdSets);
  await page.click(selector.createdSets);
  await setAction('rename-set');
  await catMan.waitForElement(selector.setActionConfirmDialog);
  await catMan.clearValue(selector.existingSetName);
  await catMan.setValue(selector.existingSetName, testSetName);
  await page.click(selector.confirmRenameSet);
  await catMan.waitForElementNotPresent(selector.setActionConfirmDialog);
};

const selectPhotoToEdit = async () => {
  await page.waitFor(2000);
  await catMan.waitForElement(selector.mediaItems);
  await page.hover(selector.mediaItems);
  photoPage = await catMan.clickAndWaitForTarget(selector.setMedia, page, browser);
  await editMedia(await photoPage);
};

const selectVideoToEdit = async () => {
  await page.waitFor(5000);
  await catMan.waitForElement(selector.mediaItems);
  await page.hover(selector.mediaItems);
  videoPage = await catMan.clickAndWaitForTarget(selector.setVideoEditBtn, page, browser);
  await editMedia(await videoPage);
};
const editMedia = async (editWindow) => {
  await editWindow.waitForSelector(selector.editDescription);
  await catMan.clearValue(selector.editDescription, editWindow);
  await catMan.setValue(selector.editDescription, testDesc, editWindow);
  await editWindow.click(selector.submitChanges);
  await editWindow.waitForSelector(selector.successAlert);
  await editWindow.close();
  await catMan.waitForElement(selector.media);
};

module.exports = {
  loginAndNavigate,
  mediaDataCountIsCorrect,
  selectAndAddMediaToNewSet,
  selectMediaTypeTab,
  renameSet,
  deleteSets,
  unpublishSet,
  selectPhotoToEdit,
  selectVideoToEdit,
};
