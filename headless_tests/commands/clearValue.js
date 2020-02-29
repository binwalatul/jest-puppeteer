module.exports = async (selector, pageInstance = page) => {
  await pageInstance.focus(selector);
  await pageInstance.click(selector, { clickCount: 3 });
  await pageInstance.keyboard.press('Backspace');
};
