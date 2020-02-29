const portfolio = require('../../commands');
const path = require('path');
const selector = require('../selectors/upload');
let user;

const loginAndNavigate = async () => {
  await page.goto(url('/upload/portfolio'));
  user = await portfolio.poolUserLogin('signed_up_contributor');
  await page.waitForSelector(selector.newbieDailogBox);
  await page.waitForSelector(selector.gotItBtn);
  await page.click(selector.gotItBtn);
  await portfolio.waitForElementNotPresent(selector.newbieDailogBox);
  await page.waitForSelector(selector.rasterizerMsg);
};

const uploadContent = async (upload) => {
  let imgType = (upload === 'good') ? 'goodImg' : 'badImg';
  const filePath = path.normalize(path.join(__dirname, `/../../data/${ imgType }.jpg`));
  await page.waitForSelector(selector.uploadBtn);
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click(selector.uploadBtn),
  ]);
  await fileChooser.accept([filePath]);
  if (upload === 'good') {
    await page.waitForSelector(selector.uploadedImg);
  } else {
    await page.waitForSelector(selector.imgUploadErr);
    let errMsg = await portfolio.getText(selector.imgUploadErrText);
    expect(errMsg.trim()).toEqual('It looks like we didn\'t get all your files. Let\'s see what happened.');
  }
};

const ftpUploadModal = async () => {
  await page.waitForSelector(selector.ftpUploadHelp);
  await page.click(selector.ftpUploadHelp);
  await page.waitForSelector(selector.ftpUploadOverlay);
  let title = await portfolio.getText(selector.ftpUploadOverlayTitle);
  expect(title.trim()).toEqual('Upload Via FTP');
  let detail = await portfolio.getText(selector.ftpUserDetail);
  expect(detail).toContain(user.user.email);
};

module.exports = {
  loginAndNavigate,
  uploadContent,
  ftpUploadModal,
};
