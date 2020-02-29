const myReferral = require('../../pageObjects/pages/myReferrals');

describe('User is able to see the referral data', () => {
  testWithRetry('User can see the total referral data', async() => {
    await myReferral.loginAndNavigate();
    await myReferral.checkTotalReferralSummary();
  // Referred contributors urls are correct
    await myReferral.referredContributorUrl();
  // User can see the list of all the referred contributors
    await myReferral.verifyreferralCtrb();
  // User is able to see the how it works section
    await myReferral.howItWorks();
  });
});
