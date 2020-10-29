const { scores } = require('../../utils/cache.json');
const api = require('../../services/api');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = {
  addScore(serverId, userId) {
    require('./src/addScore')(scores, userId, serverId);
  }
};

setInterval(() => {
  getUserPerServer();
}, 60000); // 60 segundos

function getUserPerServer() {
  const { error, apiError } = require('../../functions');
  const { apiAuthToken } = require('../../config/auth.json');

  api.get('/userPerServer', { headers: { Authorization: `Bearer ${apiAuthToken}` } })
    .then(response => {
      require('./src/saveScore')(response);
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n`+
      '> Houve um erro ao fazer uma requisição dos user_per_server para a API!\n'+
      `> Path: "${__filename}"\n`+
      `> Erro: "${apiError(e)}"`
    ));
};

getUserPerServer();