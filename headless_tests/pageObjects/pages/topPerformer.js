const topPerf = require('../../commands');
const { username, password, global_id } = require('../../utils/existingUsers').users[process.env.NODE_ENV].generic;
const getTopPerf = require('../../customMethods/getTopPerf');
const selector = require('../selectors/topPerf');

const logInAndNavigate = async () => {
  await page.goto(url('/earnings/top-performers'));
  await topPerf.login({ username, password });
  await page.waitForSelector(selector.topPerfTable);
  await page.waitForSelector(selector.noVideoEarnings);
};

const topPerfDetails = async (time) => {
  await page.waitForSelector(selector.imgThumb);
  let photoThumbs = (await page.$$(selector.imgThumb)).length;
  expect(photoThumbs).toBeGreaterThanOrEqual(1);
  const {
    topPerfEarnings,
    topPerfMediaId,
    topPerfTotal,
  } = await uiExtractedData();
  const apiDetails = await (await getTopPerf(global_id, time));
  for (let [index, top] of (apiDetails.media).entries()) {
    expect(topPerfMediaId[index]).toContain(top.media_id);
    expect(topPerfEarnings[index]).toContain((parseFloat(top.total)).toFixed(2));
    expect(topPerfTotal[index]).toContain(top.count);
    expect(top.media_type).toBe('photo');
  }
};

const uiExtractedData = async () => {
  await page.waitForSelector(selector.topPerfEarnings);
  const topPerfEarnings = await page.$$eval(selector.topPerfEarnings, tds => tds.map((earnings) => {
    return ((earnings.innerHTML).replace(/[$,]/g, '')).trim();
  }));
  await page.waitForSelector(selector.topPerfMediaId);
  const topPerfMediaId = await page.$$eval(selector.topPerfMediaId, tds => tds.map((id) => {
    return ((id.innerHTML).split(':')[1]).trim();
  }));
  await page.waitForSelector(selector.topPerfTotalDownloads);
  const topPerfTotal = await page.$$eval(selector.topPerfTotalDownloads, tds => tds.map((total) => {
    return ((total.innerHTML).replace(/[,]/g, '')).trim();
  }));

  return {
    topPerfEarnings,
    topPerfMediaId,
    topPerfTotal,
  };
};

module.exports = {
  logInAndNavigate,
  topPerfDetails,
};
