/**
 * In some extreme cases we may want to allow a test to fail a few times before it actually passes.
 * For example, it can be a solution if a test depend on a flaky service that for some reason
 * can't be fixed.
 */
const { takeScreenshot } = require('./takeScreenshot');
module.exports = (name, fn) => {
  test(name, async () => {
    let retryCount = 0;
    let retry = true;
    while (retry) {
      try {
        await fn();
        return; // exit loop
      } catch (error) {
        await takeScreenshot(name);
        if (retryCount >= process.env.maxRetries) {
          throw error;
        }
        retryCount += 1;
        console.log('TEST FAILED:', error); // eslint-disable-line no-console
        console.log(`retrying (${ retryCount }/${ process.env.maxRetries })...`); // eslint-disable-line no-console
        // create new incognito browser session for retry
        if (page) {
          await page.close();
        }
        context = await browser.createIncognitoBrowserContext();
        page = await context.newPage();
        jest.resetModules();
        require('../globals/setupTestFramework');
      }
    }
  });
};
