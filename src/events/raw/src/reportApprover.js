const { static: { eID } } = require('../../../utils/emojis.json');
const api = require('../../../services/api');
const updateErr = require('./reportUpdateErr');
const sendError = require('./reportSendError');
const alertUser = require('./reportAlertUser');

module.exports = (reportId, channelAprovado, message) => {
  api.post('/reports/update', { reports: { status: [{ id: reportId, value: 'APROVADO' }] } })
    .then(() => {
      channelAprovado.send(message.embeds[0])
        .then(msg => {
          msg.react(eID.emojicoffeecheck);

          alertUser(reportId);

          message.delete();
        }, e => sendError(e));
    }, e => updateErr(e));
};