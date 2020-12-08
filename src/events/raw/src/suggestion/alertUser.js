const client = require('../../../..');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const moment = require('moment');
const error = require('../../../../functions/error');

module.exports = (suggestionId) => {
  client.users.fetch(client.db.cache.suggestions[suggestionId].created_by).then(user => {
    const suggestion = client.db.cache.suggestions[suggestionId].suggestion;
    const feitoEm = moment(client.db.cache.suggestions[suggestionId].created_timestamp).locale('pt-br').format('LLLL');
    const status = client.db.cache.suggestions[suggestionId].status.toLowerCase();

    user.send(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      `> Sua sugestão (\`${suggestionId}\`) "${suggestion}" feita **${feitoEm}** foi **${status}**!`
    ).catch(() => { });
  }, e => error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível encontrar o user que fez uma das sugestões!\n' +
    `> ID da sugestão: "${suggestionId}"\n` +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
};