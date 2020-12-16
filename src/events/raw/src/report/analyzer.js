const client = require('../../../..');
const { static: { eID, emoji } } = require('../../../../utils/emojis.json');
const { report_analise, report_reprovados, report_aprovados } = require('../../../../config/default.json');
const reportApprover = require('./approver');
const reportReprover = require('./reprover');
const reportReproverMiddleware = require('./reproverMiddleware');
const error = require('../../../../functions/error');

module.exports = (data) => {
  client.channels.cache.get(report_analise).messages.fetch(data.d.message_id).then(message => {
    const channelAprovado = client.channels.cache.get(report_aprovados);
    const channelReprovado = client.channels.cache.get(report_reprovados);
    const reportId = Number(message.embeds[0].title);

    if (message.author.id !== client.user.id) return;

    if (data.d.emoji.id === eID.emojicoffeecheck) reportApprover(reportId, channelAprovado, message);
    if (data.d.emoji.id === eID.emojicoffeeerro) reportReproverMiddleware(reportId, channelReprovado, message);
  }, e => error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível encontrar a mensagem que continha o report para aprova-la ou reprova-la!\n' +
    `> Path: "${__filename}"\n` +
    `> ID da mensagem: "${data.d.message_id}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
};