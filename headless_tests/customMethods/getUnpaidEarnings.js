const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

module.exports = async (ctrbId) => {
  try {
    const token = await getAccessToken(ctrbId);
    const unpaidEarnings = await apiClients.callApiMethod('EarningsV2', 'getEarningsHeader', {}, token);
    return unpaidEarnings;
  } catch (error) {
    throw new Error(error);
  }
};
