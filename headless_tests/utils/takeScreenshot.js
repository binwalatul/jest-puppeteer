const path = require('path');
const mkdirp = require('mkdirp');

const screenshotsPath = path.resolve(__dirname, '../archives/screenshots');
const toFilename = (s) => s.replace(/[^a-z0-9.-]+/gi, '_');

const takeScreenshot = (testName, pageInstance = page) => {
  const testPathArray = jasmine.testPath.split('/');
  const dirName = testPathArray[testPathArray.length - 2];
  mkdirp.sync(`${ screenshotsPath}/${dirName }`);
  const filePath = path.join(
    screenshotsPath,
    dirName,
    toFilename(`${ new Date().toISOString() }_${ testName }.png`),
  );
  return pageInstance.screenshot({
    path: filePath,
    fullScreen: true,
  });
};

module.exports = {
  takeScreenshot,
};

