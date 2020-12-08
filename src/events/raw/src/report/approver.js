const { static: { eID, emoji } } = require('../../../../utils/emojis.json');
const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');
const update = require('../../../../controllers/reports/update');
const client = require('../../../..');
const error = require('../../../../functions/error');

module.exports = (reportId, channelAprovado, message) => {
  const obj = {};
  obj[reportId] = client.db.cache.reports[reportId];
  obj[reportId].status = 'APROVADO';

  update(obj).then(() => {
    channelAprovado.send(message.embeds[0]).then(msg => {
      msg.react(eID.emojicoffeecheck).catch(() => {});

      alertUser(reportId);

      message.delete().catch(e => error(
        `> ${emoji.emojicoffeeinfo} Aviso!\n` +
        `> Houve um problema ao apagar o report do canal de analise!\n` +
        `> ID: "${reportId}"\n` +
        `> Path: "${__filename}"\n` +
        `> Erro: "${JSON.stringify(e, null, 2)}"`
      ));
    }, e => sendError(e));
  }, e => updateErr(e));
};