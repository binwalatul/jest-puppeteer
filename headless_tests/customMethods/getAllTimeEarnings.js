const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

module.exports = async(ctrbId, mediaType = null) => {
  try {
    let opts = {
      media_type: mediaType,
    };
    const token = await getAccessToken(ctrbId);
    const earningsData = await apiClients.callApiMethod('EarningsV2', 'getAllTimeEarnings', opts, token);
    return earningsData;
  } catch (error) {
    throw new Error('Unexpected Response when getting contributor earnings data');
  }
};
