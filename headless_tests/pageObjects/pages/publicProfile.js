const profile = require('../../commands');
const selector = require('../selectors/publicProfile');
const random = require('randomstring');
const newDisplayName = `test user${ random.generate(4) }`;
const path = require('path');
const listSets = require('../../customMethods/getSetList');
const existingUsers = require('../../utils/existingUsers').users[process.env.NODE_ENV];
let currentName;
let userDetails;

const loginAndNavigate = async (userType) => {
  await page.goto(url('/account/public'));
  userDetails = (userType) ? await profile.login(existingUsers.generic) : await profile.poolUserLogin('signed_up_contributor')
  await page.waitForSelector(selector.portfolioForm);
};

const displayName = async () => {
  await page.waitForSelector(selector.displayName);
  currentName = await profile.getAttribute(selector.displayName, 'value');
  expect(currentName).toEqual(userDetails.user.username);
  await profile.clearValue(selector.displayName);
  await page.waitForSelector(selector.displayNameErr);
  await profile.setValue(selector.displayName, 'Test user');
  await profile.waitForElementNotPresent(selector.displayNameErr);
  await saveStatus('error');
  await profile.clearValue(selector.displayName);
  await profile.setValue(selector.displayName, newDisplayName);
  await saveStatus();
};

const portfolioUrl = async () => {
  await page.waitForSelector(selector.viewPortfolioBtn);
  let viewPortfolio = await profile.getAttribute(selector.viewPortfolioBtn, 'href');
  expect(viewPortfolio).toContain(`/g/${ userDetails.user.username }`);
  await page.waitForSelector(selector.portfolioUrl);
  const existingUrl = await profile.getAttribute(selector.portfolioUrl, 'value');
  expect(existingUrl).toEqual(userDetails.user.username);
  await page.waitForSelector(selector.portfolioNote);
  await profile.clearValue(selector.portfolioUrl);
  await profile.setValue(selector.portfolioUrl, newDisplayName);
  await page.waitForSelector(selector.portfolioValidationErr);
  await profile.clearValue(selector.portfolioUrl);
  await profile.setValue(selector.portfolioUrl, newDisplayName.replace(' ', ''));
  await saveStatus();
  await profile.waitForElementNotPresent(selector.portfolioNote);
};

const contributorBio = async (bio, include) => {
  let bioType = (bio === 'Tagline') ? selector.contributorTagline : selector.contributorBio;
  let addDescription = (include === 'email') ? 'shutterstock@gmail.com' : 'shutterstock.com';
  await page.waitForSelector(bioType);
  await profile.setValue(bioType, `This is a dummy bio with ${ addDescription } `);
  await saveStatus('error');
  await page.waitForSelector(`label[for= \'${ bioType.replace(/[#]/g, '') }']+div`);
  await profile.clearValue(bioType);
  await profile.setValue(bioType, 'This is a happy bio for a test user');
  await saveStatus();
};

const location = async () => {
  await page.waitForSelector(selector.contributorLocation);
  await page.click(selector.contributorLocation);
  await page.waitForSelector(selector.locationIndia);
  await page.click(selector.locationIndia);
};

const website = async () => {
  await page.waitForSelector(selector.contributorWebsite);
  await profile.clearValue(selector.contributorWebsite);
  await profile.setValue(selector.contributorWebsite, 'dummysite.com');
};

const socialMedia = async () => {
  const socialSites = ['#facebook', '#linkedin', '#instagram', '#twitter'];
  for (const social of socialSites) {
    await page.waitForSelector(social);
    await profile.clearValue(social);
    await profile.setValue(social, userDetails.user.username);
  }
  await saveStatus();
};

const saveStatus = async (state) => {
  let status = (state === 'error') ? selector.saveErrorMsg : selector.saveSuccessMsg;
  let message = (state === 'error') ? 'Unable to save public information. Please see errors.'
    : 'Your public information has been saved.';
  await page.click(selector.saveBtn);
  await page.waitForSelector(status);
  let uiMsg = await profile.getText(status);
  expect(uiMsg.trim()).toEqual(message);
};

const contributorType = async () => {
  await page.waitForSelector(selector.contributorType);
  await page.click(selector.contributorType);
  await page.waitForSelector(selector.contributorTypeDropdown);
  let types = ['photographer', 'illustrator', 'videographer'];
  for (const type of types) {
    await page.waitForSelector(`div[data-value='${ type }']`);
    await page.click(`div[data-value='${ type }']`);
  }
};

const contributorStyles = async () => {
  await page.waitForSelector(selector.styleList);
  await page.click(selector.styleList);
  await page.waitForSelector(selector.styleDropdown);
  let styles = ['aerial', 'astrophotography', 'fashion'];
  for (const style of styles) {
    await page.waitForSelector(`div[data-value='${ style }']`);
    await page.click(`div[data-value='${ style }']`);
  }
};

const subjects = async () => {
  await page.waitForSelector(selector.subjectList);
  await page.click(selector.subjectList);
  let contentSub = ['abstract', 'animals', 'beauty'];
  for (const subject of contentSub) {
    await page.waitForSelector(`div[data-value='${ subject }']`);
    await page.click(`div[data-value='${ subject }']`);
  }
};

const equipment = async () => {
  await page.waitForSelector(selector.equipmentList);
  await page.focus(selector.equipmentList);
  await page.type(selector.equipmentList, 'dslr, slr,');
};

const checkUpdateStatus = async () => {
  await page.waitForSelector(selector.photoUpdateSucess, {
    visible: true,
  });
  const statusText = await profile.getText(selector.photoUpdateSucess);
  expect(statusText.trim()).toBe('Your profile picture has been updated.');
  await page.reload();
};

const uploadProfilePhoto = async () => {
  const filePath = path.normalize(path.join(__dirname, '/../../data/profilePicture.jpg'));
  await profile.waitForElement(selector.uploadPhoto, 3000);
  page.focus(selector.uploadPhoto);
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click(selector.uploadPhoto),
  ]);
  await fileChooser.accept([filePath]);
  await checkUpdateStatus();
};

const deleteProfilePhoto = async () => {
  await page.waitForSelector(selector.deletePhoto);
  await page.click(selector.deletePhoto);
  await page.waitForSelector(selector.deleteConfirm);
  await page.click(selector.deleteConfirm);
  await checkUpdateStatus();
};

const publicSets = async () => {
  let setIds;
  await page.waitForSelector(selector.setContainer);
  const publicSets = await page.$$eval(selector.setContainer, ids => ids.map((setId) => {
    return setId.id;
  }));
  const catalogType = ['catalog_set', 'catalog_set_video'];
  for (const catType of catalogType) {
    setIds = await listSets(existingUsers.generic.global_id, catType);
    expect(publicSets).toEqual(expect.arrayContaining(setIds.map(id => id.id)));
  }
};

module.exports = {
  loginAndNavigate,
  displayName,
  portfolioUrl,
  contributorBio,
  location,
  website,
  socialMedia,
  contributorType,
  contributorStyles,
  saveStatus,
  equipment,
  subjects,
  uploadProfilePhoto,
  deleteProfilePhoto,
  publicSets,
};
