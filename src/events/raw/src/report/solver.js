const client = require('../../../..');
const { report_aprovados, report_solucionados } = require('../../../../config/default.json');
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const alertUser = require('./alertUser');
const sendError = require('./sendError');
const updateErr = require('./updateErr');
const update = require('../../../../controllers/reports/update');
const error = require('../../../../functions/error');

module.exports = (data) => {
  client.channels.cache.get(report_aprovados).messages.fetch(data.d.message_id).then(message => {
    const channelSolucionado = client.channels.cache.get(report_solucionados);
    const reportId = Number(message.embeds[0].title);

    if (message.author.id !== client.user.id) return;

    if (data.d.emoji.id === eID.emojicoffeecheck) {
      const obj = {};
      obj[reportId] = client.db.cache.reports[reportId];
      obj[reportId].status = 'SOLUCIONADO';

      update(obj).then(() => {
        channelSolucionado.send(message.embeds[0]).then(msg => {
          alertUser(reportId);

          message.delete().catch(e => error(
            `> ${emoji.emojicoffeeinfo} Aviso!\n` +
            `> Houve um problema ao apagar o report do canal de aprovados!\n` +
            `> ID: "${reportId}"\n` +
            `> Path: "${__filename}"\n` +
            `> Erro: "${JSON.stringify(e, null, 2)}"`
          ));
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