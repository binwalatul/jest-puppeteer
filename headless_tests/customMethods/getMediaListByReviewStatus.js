const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');
const Utility = require('../commands/index').Utility;

const getPendingMediaIds = async (ctrbId, mediaType, retry = {
  threshold: 0,
  delay: 0,
  attempt: 0,
}) => {
  // media_type: photo or video
  await Utility.wait(retry.delay);
  let currentAttempt = retry.attempt + 1;
  const opts = {
    media_type: `${ mediaType }`,
    status: 'pending',
  };
  const mediaIds = [];
  const token = await getAccessToken(ctrbId);
  const ctrbMediaIds = await apiClients.callApiMethod('Media', 'listMediaByReviewStatus', opts, token);
  (ctrbMediaIds.data).forEach(async (elem) => {
    mediaIds.push(elem.media_id);
  });
  if (mediaIds === undefined && currentAttempt < retry.threshold) {
    return getPendingMediaIds(ctrbId, mediaType, {
      ...retry,
      attempt: currentAttempt,
    });
  } else {
    return mediaIds;
  }
};

module.exports = getPendingMediaIds;
