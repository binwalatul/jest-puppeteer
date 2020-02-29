module.exports = async (element) => {
  await page.waitForSelector(element, {
    visible: false,
    hidden: true,
  });
};
