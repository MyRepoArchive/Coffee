const { static: { eID } } = require('../../../src/utils/emojis.json');
const api = require('../../../../services/api');
const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');

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