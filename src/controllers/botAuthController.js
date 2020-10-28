const auth = require('../config/auth.json');
const api = require('../services/api');
const client = require('../');
const { error, apiError } = require('../functions');
const { static: { emoji } } = require('../utils/emojis.json');

setInterval(() => {
  api.post('/auth', { id: client.user.id, password: auth.apiPassword })
    .then(response => auth.apiAuthToken = response.data.token)
    .catch(e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n`+
      '> Houve um erro ao autenticar o bot na api.\n'+
      `> Erro: "${apiError(e)}"`
    ));
}, 60000 * 5); // A cada 5 horas ele atualiza o token de authorização

api.post('/auth', { id: client.user.id, password: auth.apiPassword })
  .then(response => auth.apiAuthToken = response.data.token)
  .catch(e => {
    error(
      `> ${emoji.emojicoffeeerro} Erro!\n`+
      '> Houve um erro ao autenticar o bot na api.\n'+
      `> Erro: "${apiError(e)}"`
    );
  });
