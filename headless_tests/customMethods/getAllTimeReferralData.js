const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

const getAllTimeReferralData = async (ctrbId) => {
  try {
    const token = await getAccessToken(ctrbId);
    const referralData = await apiClients.callApiMethod('EarningsV2', 'getReferralsSummary', {}, token);
    return referralData;
  } catch (error) {
    throw new Error('Unexpected response when getting total referral summary for user');
  }
};

module.exports = getAllTimeReferralData;
