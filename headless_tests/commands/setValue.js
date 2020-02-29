module.exports = async(selector, text, pageInstance = page) => {
  await pageInstance.focus(selector);
  await pageInstance.keyboard.type(text);
};
