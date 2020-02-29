const keywordTool = require('../../pageObjects/pages/keywordTool');

describe('Keyword suggetion tool is working with copy and edit mode', () => {
  testWithRetry('Keyword suggestions tool in copy mode', async () => {
    await keywordTool.logInAndNavigate();
    await keywordTool.openKeywordTool();
    await keywordTool.extractKeywords('copy');
    await keywordTool.verifyCopiedKeywords('copy');
  // Keyword suggestions tool in edit mode
    await keywordTool.openKeywordTool();
    await keywordTool.extractKeywords();
    await keywordTool.verifyCopiedKeywords();
  });
});
