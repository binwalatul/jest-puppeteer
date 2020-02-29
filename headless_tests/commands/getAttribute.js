module.exports = async (selector, attr) => {
  await page.waitForSelector(selector);
  let elementLocator = await page.$(selector);
  let elementAttr = await elementLocator.getProperty(attr);
  let elementText = await elementAttr.jsonValue();
  return elementText;
};
