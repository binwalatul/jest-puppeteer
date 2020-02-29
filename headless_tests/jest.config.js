module.exports = {
  setupFilesAfterEnv: ['./globals/setupTestFramework.js'],
  preset: 'jest-puppeteer',
  testEnvironment: './globals/customEnvironment.js',
  verbose: true,
  reporters: ['default'],
};
