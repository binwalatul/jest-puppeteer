module.exports = async (element, waitTime=1000) => {
  await page.waitForSelector(element, {
    visible: true,
    hidden: false,
  });
  await page.waitFor(waitTime);
};
