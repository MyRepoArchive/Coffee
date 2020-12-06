const api = require('../../../../services/api');
const client = require('../../../src');
const { static: { emoji } } = require('../../../src/utils/emojis.json');
const moment = require('moment');
const error = require('../../../src/functions/error');

module.exports = (reportId) => {
  api.get(`/reports/${reportId}`)
    .then(response => {
      client.users.fetch(response.data.created_by)
        .then(user => {
          const report = response.data.report;
          const feitoEm = moment(response.data.created_timestamp).locale('pt-br').format('LLLL');
          const status = response.data.status.toLowerCase();

          user.send(
            `> ${emoji.emojicoffeeinfo} Aviso!\n` +
            `> Seu report (\`${reportId}\`) "${report}" feito **${feitoEm}** foi **${status}**!\n` +
            `${status === 'aprovado' ? '> Agora ele será corrigido o mais rápido possível!' : ''}`
          ).catch(() => { });
        }, e => error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Não foi possível encontrar o user que fez um dos reports!\n' +
          `> ID do report: "${response.data.id}"\n` +
          `> Path: "${__filename}"\n` +
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        ));
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro\n` +
      '> Houve um erro ao buscar um report na API\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${apiError(e)}"`
    ));
};