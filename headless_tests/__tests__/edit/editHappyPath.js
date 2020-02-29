const edit = require('../../pageObjects/pages/edit');

describe('User is able to delete and submit media from content editor', () => {
  testWithRetry('User is able to complete the submission flow', async () => {
    await edit.logInNavigate();
    await edit.selectMedia(0, 1);
    await edit.deleteSelectedMedia();
  // User is able to submit first image content batch
    await edit.selectMedia(0, 3);
    await edit.fillUpMediaMetadata();
    await edit.addLocation('Pittsburgh');
    await edit.mediaBatchSubmission('first');
  // User is able to submit second image content batch
    await edit.selectMedia(0, 1);
    await edit.fillUpMediaMetadata();
    await edit.addLocation('Pittsburgh');
    await edit.selectMedia(1, 2);
    await edit.verifyDescription('Multiple descriptions');
    await edit.fillUpMediaMetadata();
    await edit.addLocation('Pittsburgh');
    await edit.mediaBatchSubmission('second');
  // User is able to delete pending content
    await edit.moveToTab('Pending');
    await edit.selectMedia(0, 1);
    await edit.deletePendingMedia();
    await edit.rejectPendingMedia();
  });
});
