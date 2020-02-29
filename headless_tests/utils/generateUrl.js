const urljoin = require('url-join');

const urlConfig = {
  defaultUrl: 'localhost:3000/',
  local: 'localhost:3000/',
  dev: 'submit.integration.dev.shutterstock.com/',
  qa: 'submit.qa.shutterstock.com/',
};

module.exports = route => {
  const baseUrl = process.env.CONTRIBUTOR_WEB_ENDPOINT
    || urlConfig[process.env.NODE_ENV]
    || urlConfig.defaultUrl;
  const url = route ? urljoin(baseUrl, route) : baseUrl;
  return 'http://' + url;
};
