const header = require('../../commands');
const selector = require('../selectors/header');
const env = (process.env.NODE_ENV === 'qa') ? 'qa' : 'integration.dev';
const headerLinks = {
  'Earnings Summary': `https://submit.${ env }.shutterstock.com/earnings?language=en`,
  'My Referrals': `https://submit.${ env }.shutterstock.com/referrals?language=en`,
  'Payment History': `https://submit.${ env }.shutterstock.com/payments?language=en`,
  'Tax Center': `https://submit.${ env }.shutterstock.com/legal/taxes?language=en`,
  'Upload': `https://submit.${ env }.shutterstock.com/upload/portfolio?language=en`,
  'Submit Content': `https://submit.${ env }.shutterstock.com/edit?type=photo&language=en`,
  'Pending Content': `https://submit.${ env }.shutterstock.com/pending?type=photo&language=en`,
  'Reviewed Content': `https://submit.${ env }.shutterstock.com/reviewed?type=photo&language=en`,
  'Catalog Manager': `https://submit.${ env }.shutterstock.com/catalog_manager`,
  'Manage Releases': `https://submit.${ env }.shutterstock.com/releases?language=en`,
  'Keyword Suggestions': `https://submit.${ env }.shutterstock.com/edit/keyword-tool?language=en`,
  'Referral Program': `https://submit.${ env }.shutterstock.com/promotions/referrals/`,
  'Top Performers': `https://submit.${ env }.shutterstock.com/earnings/top-performers?language=en`,
  'The Shot List': 'https://www.shutterstock.com/en/explore/the-shot-list',
  'Forum': 'https://forums.submit.shutterstock.com/',
  'Contributor Blog': 'https://www.shutterstock.com/contributor-blog?pl=SubGF',
};

const loginAndNavigate = async () => {
  await page.goto(url('/catalog_manager'));
  await header.poolUserLogin('signed_up_contributor');
  await page.waitForSelector(selector.navTab);
};

const dropdownUrls = async () => {
  await page.waitForSelector(selector.headerHref);
  let hrefs = await page.$$(selector.headerHref);
  for (const [index, urls] of hrefs.entries()) {
    expect(await (await urls.getProperty('href')).jsonValue()).toEqual((Object.values(headerLinks))[index]);
  }
};

module.exports = {
  loginAndNavigate,
  dropdownUrls,
};
