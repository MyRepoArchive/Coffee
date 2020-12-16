const client = require('../../../..');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const moment = require('moment');
const error = require('../../../../functions/error');

module.exports = (reportId) => {
  client.users.fetch(client.db.cache.reports[reportId].created_by).then(user => {
    const report = client.db.cache.reports[reportId].report;
    const feitoEm = moment(client.db.cache.reports[reportId].created_timestamp).locale('pt-br').format('LLLL');
    const status = client.db.cache.reports[reportId].status.toLowerCase();
    const reason = client.db.cache.reports[reportId].reason;

    user.send(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      `> Seu report (\`${reportId}\`) "${report}" feito **${feitoEm}** foi **${status}**!\n` +
      `${status === 'aprovado' ? '> Agora ele será corrigido o mais rápido possível!\n' : ''}` +
      `${status === 'reprovado' ? `> Motivo: "${reason}"` : ''}`
    ).catch(() => { });
  }, e => error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível encontrar o user que fez um dos reports!\n' +
    `> ID do report: "${reportId}"\n` +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
};