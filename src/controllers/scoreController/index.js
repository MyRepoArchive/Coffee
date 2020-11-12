const { scores } = require('../../utils/cache');
const api = require('../../services/api');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = {
  addScore(serverId, userId) {
    require('./src/addScore')(userId, serverId);
  }
};

setInterval(() => {
  getMembers();
}, 60000); // 60 segundos

function getMembers() {
  const { error, apiError } = require('../../functions');

  api.get('/members')
    .then(response => {
      require('./src/saveScore')(response.data, scores);
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n`+
      '> Houve um erro ao fazer uma requisição dos user_per_server para a API!\n'+
      `> Path: "${__filename}"\n`+
      `> Erro: "${apiError(e)}"`
    ));
};

getMembers();