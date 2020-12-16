const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');
const update = require('../../../../controllers/reports/update');
const error = require('../../../../functions/error');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const client = require('../../../..');

module.exports = (reportId, channelReprovado, message, reason) => {
  const obj = {};
  obj[reportId] = client.db.cache.reports[reportId];
  obj[reportId].status = 'REPROVADO';
  obj[reportId].reason = reason;

  update(obj).then(() => {
    channelReprovado.send(message.embeds[0]).then(msg => {
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