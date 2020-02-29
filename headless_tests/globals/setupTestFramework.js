global.testWithRetry = require('./../utils/testWithRetry');

(() => {
// Timeout interval for tests and before/after hooks in milliseconds.
// Note: The default timeout interval is 5 seconds.
  jest.setTimeout(500000);

  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetdefaultnavigationtimeouttimeout
  page.setDefaultNavigationTimeout(90000);
  page.setDefaultTimeout(90000);

  // Set the viewport as defaultViewport does not work in headless mode
  if (process.env.HEADLESS !== 'false') {
    page.setViewport({
      width: 1920,
      height: 1080,
    });
  }
})();
