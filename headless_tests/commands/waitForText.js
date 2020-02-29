module.exports = async (selector, expectedText) => {
  await page.waitForFunction(text => document.querySelector(`'${ text }'`).innerText.includes(expectedText), { }, selector);
};
