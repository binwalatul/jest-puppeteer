const selector = require('../selectors/signUp');
const signUp = require('../../commands');
let state;
// @param: "signed_up_no_address" & "basic_rejected"
const signUpUser = async (user) => {
  (user === 'signed_up_no_address') ? state = 'accept' : state = 'reject';
  await page.goto(url('/dashboard'));
  await signUp.poolUserLogin(`${ user }`);
  await page.waitForSelector(selector.address);
};

const signUpAddress = async () => {
  await page.waitForSelector('select[name="residential-country"]');
  await page.select('select[name="residential-country"]', 'af');
  await signUp.setValue(selector.residential_line1, 'Test add line 1');
  await signUp.setValue(selector.residential_line2, 'Test add line 2');
  await signUp.setValue(selector.residential_city, 'Test');
  await signUp.setValue(selector.residential_postal_code, '12345');
  await signUp.setValue(selector.residential_phone, '123456789');
  await page.click(selector.next_page_button);
};

const siftCheck = async () => {
  if (state === 'accept') {
    await page.waitForSelector(selector.approvedId);
    expect(await page.url()).toContain('/signup/welcome');
  } else if (state === 'reject') {
    await page.waitForSelector(selector.rejectedId);
    expect(await page.url()).toContain('/account/verification');
  }
};

module.exports = {
  signUpUser,
  signUpAddress,
  siftCheck,
};
