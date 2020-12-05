const api = require('../../../../services/api');
const client = require('../../../src');
const { static: { emoji } } = require('../../../src/utils/emojis.json');
const moment = require('moment');
const error = require('../../../src/functions/error');

module.exports = (suggestionId) => {
  api.get(`/suggestions/${suggestionId}`)
    .then(response => {
      client.users.fetch(response.data.created_by)
        .then(user => {
          const suggestion = response.data.suggestion;
          const feitoEm = moment(response.data.created_timestamp).locale('pt-br').format('LLLL');
          const status = response.data.status.toLowerCase();

          user.send(
            `> ${emoji.emojicoffeeinfo} Aviso!\n` +
            `> Sua sugestão (\`${suggestionId}\`) "${suggestion}" feita **${feitoEm}** foi **${status}**!`
          ).catch(() => { });
        }, e => error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Não foi possível encontrar o user que fez uma das sugestões!\n' +
          `> ID da sugestão: "${response.data.id}"\n` +
          `> Path: "${__filename}"\n` +
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        ));
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro\n` +
      '> Houve um erro ao buscar uma suggestion na API\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${apiError(e)}"`
    ));
};