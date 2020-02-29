const contact = require('../../commands');
const selector = require('../selectors/contactUs');
const expectedHeadings = ['Account Changes',
  'Log-in Issues',
  'Search Results and Indexing',
  'Earnings, Payouts & Taxes',
  'Account Warnings',
  'Sign-up (First-time Submissions)',
  'ID Verification & Business Registration',
  'Referrals',
  'Portfolio Tools',
  'Uploading & Submitting Content',
  'Editorial Content & Credentials',
  'Content Review',
  'Releases, Trademarks & Metadata',
  'Content Misuse',
  'Infringement',
  'Report a Bug',
  'Shutterstock Contributor App',
  'Shutterstock Music & PremiumBeat',
  'All Other Issues',
];

const loginAndNavigate = async () => {
  await page.goto(url(''));
  await page.waitForSelector(selector.loginBtn);
  await page.click(selector.loginBtn);
  await contact.poolUserLogin('signed_up_contributor');
  await page.goto(url('/contact'));
  await page.waitForSelector(selector.contactUs);
  await page.waitForSelector(selector.topQues);
  await contact.waitForElementNotPresent(selector.issueDesc);
};

const submitQuery = async (queryType) => {
  switch (queryType) {
    case 'Accounts': sel = selector.accountIssue; query = 'Name change';
      break;
    case 'SignUp': sel = selector.signUpIssue; query = 'Where to Register';
      break;
    case 'Portfolio': sel = selector.portfolioIssue; query = 'Catalog Manager';
      break;
    case 'ReportBug': sel = selector.reportBug; query = 'Contributor App';
      break;
    default: 'Invalid query type.';
      break;
  }
  await page.waitForSelector(sel);
  await page.click(sel);
  await contact.waitForElement(selector.issueType);
  await page.waitForSelector(selector.issueDesc);
  await page.click(selector.issueDesc);
  await page.click(selector.stillNeedHelp);
  await contact.waitForElement(selector.descErrMsg);
  await page.select(selector.issueType, query);
  await contact.setValue(selector.issueDesc, 'Dummy issue for testing');
  await page.click(selector.submitIssue);
  await page.waitForSelector(selector.successMsg);
  await page.reload();
};

const copyCheck = async () => {
  let headings = [];
  let queryTopics = await page.$$(selector.existingTopics);
  for (topics of queryTopics) {
    let text = await page.evaluate(el => el.innerText, topics);
    headings.push(text);
  }
  expect(expectedHeadings).toEqual(headings);
};

module.exports = {
  loginAndNavigate,
  submitQuery,
  copyCheck,
};
