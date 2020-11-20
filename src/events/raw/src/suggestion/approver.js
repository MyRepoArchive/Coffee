const { static: { eID } } = require('../../../../utils/emojis.json');
const api = require('../../../../services/api');
const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');

module.exports = (suggestionId, channelAprovado, message) => {
  api.post('/suggestions/update', { suggestions: { status: [{ id: suggestionId, value: 'APROVADO' }] } })
    .then(() => {
      channelAprovado.send(message.embeds[0])
        .then(msg => {
          alertUser(suggestionId);

          message.delete();
        }, e => sendError(e));
    }, e => updateErr(e));
};