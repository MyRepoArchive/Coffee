const api = require('../../../../services/api');
const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');

module.exports = (suggestionId, channelReprovado, message) => {
  api.post('/suggestions/update', { suggestions: { status: [{ id: suggestionId, value: 'REPROVADO' }] } })
    .then(() => {
      channelReprovado.send(message.embeds[0])
        .then(msg => {
          alertUser(suggestionId);

          message.delete();
        }, e => sendError(e));
    }, e => updateErr(e));
};