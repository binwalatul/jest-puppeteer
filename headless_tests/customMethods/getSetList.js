const getAccessToken = require('./getAccessToken');
const apiClients = require('../../../api_clients');

module.exports = async (ctrbId, setType) => {
  try {
    const opts = {
      is_public: true,
      is_primary: true,
      application_namespace: setType,
    }
    const token = await getAccessToken(ctrbId);
    const setList = await apiClients.callApiMethod('User', 'listSets', opts, token);
    return setList;
  } catch (error) {
    throw new Error(error);
  }
};
