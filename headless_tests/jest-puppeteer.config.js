/** For debugging purposes,
 * set dumpio: true to have chromium stdout / stderr in the console  */

module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: 25,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
    ],
  },
  browserContext: 'incognito',
  exitOnPageError: false, // Don't fail on js console errors on the page
};
