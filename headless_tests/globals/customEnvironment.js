const DefaultEnvironment = require('jest-environment-puppeteer');

class CustomEnvironment extends DefaultEnvironment {
  async setup() {
    await super.setup();
    this.global.url = require('./../utils/generateUrl');
  }

  async teardown() {
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
