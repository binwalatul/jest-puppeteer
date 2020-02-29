const w8Ben = require('../../pageObjects/pages/taxes');

describe('Non-US users are able seeing W8-Ben form', () => {
  testWithRetry('Non-US user contributing as an individual is able to see w8-Ben and submit it as approved', async() => {
    await w8Ben.loginAndNavigate({ user: 'Non-US' });
    await w8Ben.questionnaire({ ctrbType: 'INDIVIDUAL' });
    await w8Ben.submitW8Form('fr');
  // 'Non-US user contributing as an Business is not seeing w8-Ben but other forms options'
    await w8Ben.submitNewForm();
    await w8Ben.questionnaire({ country: 'Non-US', ctrbType: 'BUSINESS' });
    await w8Ben.NonUsAndBusiness();
  // 'Non-US user contributing as an individual is able to see w8-Ben and submit it in pending state'
    await w8Ben.submitNewForm();
    await w8Ben.questionnaire({ ctrbType: 'INDIVIDUAL' });
    await w8Ben.submitW8Form('af');
  });
});
