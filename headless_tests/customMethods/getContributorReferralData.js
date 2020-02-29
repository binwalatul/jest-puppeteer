const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

const getContributorReferralData = async (ctrbId) => {
  try {
    const token = await getAccessToken(ctrbId);
    const referralData = await apiClients.callApiMethod('EarningsV2', 'listContributorReferrals', {}, token);
    return referralData;
  } catch (error) {
    throw new Error('Unexpected Response when getting contributor referral data for user');
  }
};

module.exports = getContributorReferralData;
