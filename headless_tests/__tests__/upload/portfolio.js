const portfolio = require('../../pageObjects/pages/upload');

describe('User is able to upload content', () => {
  testWithRetry('User is able to upload image from the page', async () => {
  // User is unable to upload the invalid image.
    await portfolio.loginAndNavigate();
    await portfolio.uploadContent('bad');
  // User is able to upload the valid image.
    await portfolio.uploadContent('good');
    await portfolio.ftpUploadModal();
  });
});
