const accAddress = require('../../commands');
const selectors = require('../selectors/accountAddress');
const saveAddMsg = 'Your address was saved successfully.';
const title = 'Change of Address Form | Shutterstock';
const saveScheduled = 'For tax reasons, we\'ll need to approve your address change. A member of our support team will get in touch with you.';

const addressFields = [
  {
    field: selectors.residential_line1,
    value: 'test',
    errorMsg: selectors.residential_line1_error,
  },
  {
    field: selectors.residential_line2,
    value: 'testa',
    errorMsg: selectors.residential_line2_error,
  },
  {
    field: selectors.residential_postal_code,
    value: 'test()',
    errorMsg: selectors.residential_postal_code_error,
  },
  {
    field: selectors.residential_phone,
    value: '12345678',
    errorMsg: selectors.residential_phone_error,
  },
];

module.exports = {
  navigateToPage: async () => {
    await page.goto(url('/account/address'));
    await accAddress.poolUserLogin('signed_up_non_us_contributor');
    await accAddress.waitForElement(selectors.residential_city);
    await expect(page.title()).resolves.toMatch(title);
  },
  changeExistingAddress: async (country) => {
    if (country) {
      await page.select(selectors.residential_country, 'af');
    }
    for (const address of addressFields) {
      await accAddress.waitForElement(address.field);
      await accAddress.clearValue(address.field);
      await page.type(address.field, address.value);
    }
    await page.click(selectors.saveAddressBtn);
    if (country) {
      await accAddress.waitForElement(selectors.addressUpdateMsg);
      let saveScheduleMsg = await accAddress.getText(selectors.addressUpdateMsg);
      await expect(saveScheduleMsg.trim()).toEqual(saveScheduled);
    } else {
      await accAddress.waitForElement(selectors.addressUpdated);
      let saveMsg = await accAddress.getText(selectors.addressUpdated);
      await expect(saveMsg.trim()).toEqual(saveAddMsg);
    }
  },
};
