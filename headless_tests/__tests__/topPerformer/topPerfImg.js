const topPerf = require('../../pageObjects/pages/topPerformer');

describe('Top performer data for images', () => {
  testWithRetry('should see the top performer images for the user', async () => {
    await topPerf.logInAndNavigate();
    await topPerf.topPerfDetails();
  });
});
