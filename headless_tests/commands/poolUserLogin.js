/*
* For the acceptable pool parameters please refer to the below link -:
* https://github.shuttercorp.net/qa-tools/pool-party-two-point-oh-contributor/blob/master/config/default.js
*/
const Contributor = require('shutterstock-test-user').Contributor;
const login = require('./login');

module.exports = async (poolParty) => {
  const loginInfo = await Contributor.getContributorPP(poolParty);
  await login(loginInfo.user);
  return loginInfo;
};
