const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

module.exports = async (ctrbId) => {
  try {
    const token = await getAccessToken(ctrbId);
    const contentStatus = await apiClients.callApiMethod('Media', 'getContentStatus', {}, token);
    return contentStatus;
  } catch (error) {
    throw new Error(error);
  }
};
