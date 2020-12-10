const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const defaultPrefix = require('../../../../config/default.json').prefix;
const set = require('./set');

module.exports = (message, permissions, oldPrefix) => {
  const msg =
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> Você deve passar o novo prefixo do bot como parâmetro do comando, para saber mais use ${oldPrefix}ajuda setprefix\n` +
    `> Se deseja apenas setar o prefixo padrão do bot, reaja com ${emoji.emojicoffeegears} nesta mensagem ou envie \`OK\` abaixo dentro de 1 minuto.`

  chatOrDm(msg, permissions, message).then(async mess => {
    await mess.react(eID.emojicoffeegears).catch(() => { });

    mess.createReactionCollector(
      (reaction, user) => reaction.emoji.id === eID.emojicoffeegears && user.id === message.author.id, { max: 1, time: 60000 }
    ).on('collect', () => set(oldPrefix, defaultPrefix, message, permissions));

    mess.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { max: 1, time: 60000 }).on('collect', (mensagem) => {
      if (mensagem.content.toLowerCase() === 'ok') set(oldPrefix, defaultPrefix, message, permissions);
    });
  });
};