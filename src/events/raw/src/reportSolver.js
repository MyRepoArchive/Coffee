const client =  require('../../..');
const { report_aprovados, report_solucionados } = require('../../../config/default.json');
const { static: { emoji, eID } } = require('../../../utils/emojis.json');
const api = require('../../../services/api');
const alertUser = require('./reportAlertUser');
const sendError = require('./reportSendError');
const updateErr = require('./reportUpdateErr');

module.exports = (data) => {
  const { error } = require('../../../functions');

  client.channels.cache.get(report_aprovados).messages.fetch(data.d.message_id)
    .then(message => {
      const channelSolucionado = client.channels.cache.get(report_solucionados);
      const reportId = Number(message.embeds[0].title);
      console.log(message.reactions.cache)

      if (message.author.id !== client.user.id) return;

      if (data.d.emoji.id === eID.emojicoffeecheck) {
        api.post('/reports/update', { reports: { status: [{ id: reportId, value: 'SOLUCIONADO' }] } })
          .then(() => {
            channelSolucionado.send(message.embeds[0])
              .then(msg => {
                alertUser(reportId);

                message.delete();
              }, e => sendError(e));
          }, e => updateErr(e));
      };
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> Não foi possível encontrar a mensagem que continha o report para colocá-la como solucionada!\n' +
      `> Path: "${__filename}"\n` +
      `> ID da mensagem: "${data.d.message_id}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};