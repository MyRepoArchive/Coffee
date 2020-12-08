const updateErr = require('./updateErr');
const sendError = require('./sendError');
const alertUser = require('./alertUser');
const client = require('../../../..');
const update = require('../../../../controllers/suggestions/update');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (suggestionId, channelAprovado, message) => {
  const obj = {};
  obj[suggestionId] = client.db.cache.suggestions[suggestionId];
  obj[suggestionId].status = 'APROVADO';

  update(obj).then(() => {
    channelAprovado.send(message.embeds[0]).then(() => {
      alertUser(suggestionId);

      message.delete().catch(e => error(
        `> ${emoji.emojicoffeeinfo} Aviso!\n` +
        `> Houve um problema ao apagar o suggestion do canal de analise!\n` +
        `> ID: "${suggestionId}"\n` +
        `> Path: "${__filename}"\n` +
        `> Erro: "${JSON.stringify(e, null, 2)}"`
      ));
    }, e => sendError(e));
  }, e => updateErr(e));
};