const api = require('../../../../services/api');
const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');

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