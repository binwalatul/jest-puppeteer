module.exports = async (user) => {
  await page.waitForSelector('#login-username');
  await page.type('#login-username', user.username);
  await page.waitForSelector('#login-password');
  await page.type('#login-password', user.password);
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.setAttribute('name', 'captcha_bypass');
    input.setAttribute('value', 'sesame');
    input.setAttribute('type', 'hidden');
    document.querySelector('#login-form').appendChild(input);
  });
  await page.click('#login');
};
