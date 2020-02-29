const lohp = require('../../commands');
const selectors = require('../selectors/lohp');
const pageHrefs = {
  blog: '/blog/contributors',
  supportCentre: '/contributorsupport',
  sstkLogo: '/dashboard?language=en',
  logIn: '/login',
  signUp: '/signup',
  getStarted: '/signup',
  joinNow: '/signup',
  globalEarnings: '/blog/1-billion-contributor-earnings',
  exploreTools: '/explore/contributor-editor-go-to',
  joinNowStory4: '/signup',
  learnMore: '/explore/contributor-mobile-app',
  shotList: '/explore/the-shot-list',
  videoWorkshops: 'https://www.youtube.com/channel/UCKyVN7fBTaQ3np4WOO7IK9A',
  ctrbBlog: '/contributor-blog',
  joinNowBottom: '/signup',
  signInBottom: '/login',
};
const pageText = {
  heading: 'Share your work and start earning.',
  subHeading: 'Join Shutterstock\'s global community of contributors and earn money doing what you love.',
  subTitle: 'Become a Contributor',
  sellingPoint1: 'Produce high-quality images and videos for our customers to download.',
  sellingPoint2: 'Upload your content with our easy-to-use platform, and get tips for success.',
  sellingPoint3: 'Make money every time your content is downloaded by one of our worldwide customers.',
  sellingPoint4: 'Earn even more by referring new contributors and customers.',
  storyText1: 'More than $1 billion paid out',
  storyText2: 'Join our global community',
  storyText3: 'Easy-to-use tools',
  storyText4: 'Global marketplace',
  storyText5: 'Get the contributor app',
};

const impHyperLinks = async () => {
  await page.goto(url(''));
  let links = selectors.elements.impHref;
  for (const key of Object.keys(links)) {
    await page.waitForSelector(links[key]);
    expect(await lohp.getAttribute(links[key], 'href')).toMatch(pageHrefs[key]);
  }
};

const copyCheck = async () => {
  let copy = selectors.elements.impText;
  for (const text of Object.keys(copy)) {
    expect(await lohp.getText(copy[text])).toMatch(pageText[text]);
  }
};

module.exports = {
  impHyperLinks,
  copyCheck,
};
