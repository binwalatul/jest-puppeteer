const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

module.exports = async (ctrbId) => {
  try {
    const token = await getAccessToken(ctrbId);
    const topPerf = await apiClients.callApiMethod('EarningsV2', 'getGalleryStats', {}, token);
    return topPerf;
  } catch (error) {
    throw new Error(error);
  }
};
