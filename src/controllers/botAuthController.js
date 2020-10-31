const auth = require('../config/auth.json');
const api = require('../services/api');
const client = require('../');
const { static: { emoji } } = require('../utils/emojis.json');

setInterval(() => {
  authenticate();
}, 60000 * 5); // A cada 5 horas ele atualiza o token de authorização

function authenticate() {
  const { error, apiError } = require('../functions');

  return new Promise((resolve, reject) => {
    api.post('/auth', { id: client.user.id, password: auth.apiPassword })
    .then(response => {
      auth.apiAuthToken = response.data.token;
      resolve();
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao autenticar o bot na api.\n' +
        `> Path: "${__filename}"\n` +
        `> Erro: "${apiError(e)}"`
      );
      reject();
    });
  });
};

module.exports = authenticate;