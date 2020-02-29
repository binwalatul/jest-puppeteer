const request = require('request-promise');
const _ = require('lodash');
const adminApiConfig = require('config').get('adminApiClient');

const clientOpts = {
  client_id: adminApiConfig.client_id,
  client_secret: adminApiConfig.client_secret,
};
const accountsUrl = adminApiConfig.accounts_url;

const _requestToken = async (opts) => {
  const obj = {
    method: 'POST',
    uri: accountsUrl,
    form: opts,
    json: true,
  };
  const response = await request(obj);
  const accessToken = _.get(response, 'access_token');
  return accessToken;
};

const getAccessToken = async (userId) => {
  const opts = _.assign({}, clientOpts, {
    user_id: userId,
    grant_type: 'impersonation',
  });
  const token = await _requestToken(opts);
  return token;
};

module.exports = getAccessToken;
