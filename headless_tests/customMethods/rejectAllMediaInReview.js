const { ReviewerAgent } = require('content-acceptance-utils');
const mediaIds = require('./getMediaListByReviewStatus');

/*
* This function will reject the content submitted by our acceptance tests
* opts = {
* ctrbID: 503336644,
* domain: 'shutterstock_photo'/'shutterstock_video',
* }
*/

const rejectPendingContent = async (opts) => {
  try {
    const review = {
      verdict: 'rejected',
      reasons: [{
        name: 'suspicious_content',
      }],
    };
    const retryAttempt = {
      threshold: 6,
      delay: 10000,
      attempt: 0,
      allow_violation: false,
    };
    const mediaList = await mediaIds(opts.ctrbID, opts.mediaType, retryAttempt);
    const agent = new ReviewerAgent();
    await agent.reviewBatchesForMedia(mediaList, opts.domain, review, retryAttempt);
  } catch (err) {
    console.log(`Failed to submit reviews for contributorId: ${opts.ctrbID}, mediaIds: ${mediaIds}:`, err); // eslint-disable-line
  }
}

module.exports = rejectPendingContent;
