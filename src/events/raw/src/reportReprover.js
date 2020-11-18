const api = require('../../../services/api');
const updateErr = require('./reportUpdateErr');
const sendError = require('./reportSendError');
const alertUser = require('./reportAlertUser');

module.exports = (reportId, channelReprovado, message) => {
  api.post('/reports/update', { reports: { status: [{ id: reportId, value: 'REPROVADO' }] } })
    .then(() => {
      channelReprovado.send(message.embeds[0])
        .then(msg => {
          alertUser(reportId);

          message.delete();
        }, e => sendError(e));
    }, e => updateErr(e));
};