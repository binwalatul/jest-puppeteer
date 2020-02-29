module.exports = async (selector) => {
  await page.waitForSelector(selector);
  let text = await page.evaluate(el => el.innerText, await page.$(selector));
  return text;
};
