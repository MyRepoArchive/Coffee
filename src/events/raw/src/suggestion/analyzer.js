const client = require('../../../..');
const { static: { eID, emoji } } = require('../../../../utils/emojis.json');
const { suggestion_analise, suggestion_reprovados, suggestion_aprovados } = require('../../../../config/default.json');
const suggestionApprover = require('./approver');
const suggestionReprover = require('./reprover');

module.exports = (data) => {
  const { error } = require('../../../../functions');

  client.channels.cache.get(suggestion_analise).messages.fetch(data.d.message_id)
    .then(message => {
      const channelAprovado = client.channels.cache.get(suggestion_aprovados);
      const channelReprovado = client.channels.cache.get(suggestion_reprovados);
      const suggestionId = Number(message.embeds[0].title);

      if (message.author.id !== client.user.id) return;

      if (data.d.emoji.id === eID.emojicoffeecheck) suggestionApprover(suggestionId, channelAprovado, message)
      if (data.d.emoji.id === eID.emojicoffeeerro) suggestionReprover(suggestionId, channelReprovado, message);
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> Não foi possível encontrar a mensagem que continha a sugestão para aprova-la ou reprova-la!\n' +
      `> Path: "${__filename}"\n` +
      `> ID da mensagem: "${data.d.message_id}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};