module.exports = async (clickSelector, page, browser) => {
  const pageTarget = page.target(); // save this to know that this was the opener
  await page.waitForSelector(clickSelector);
  await page.click(clickSelector); // click on a link
  const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget); // check that you opened this page, rather than just checking the url
  const newPage = await newTarget.page(); // get the page object
  await newPage.waitForSelector('body'); // wait for page to be loaded
  return newPage;
};
