const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji, eID }, animated: { emoji: { loading2 } } } = require('../../../../utils/emojis.json');
const defaultPrefix = require('../../../../config/default.json').prefix;
const set = require('./set');

module.exports = (message, permissions, oldPrefix) => {
  const msg = (person) => 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> Você deve passar o novo prefixo do bot como parâmetro do comando, para saber mais use ${oldPrefix}ajuda setprefix\n` +
    `> Se deseja apenas setar o prefixo padrão do bot, reaja com ${person ? emoji.emojicoffeegears : '1️⃣'} nesta mensagem ou envie \`OK\` abaixo dentro de 1 minuto.`;

  chatOrDm(`${loading2} Configurando...`, permissions, message).then(async mess => {
    await mess.react(eID.emojicoffeegears).then(() => mess.edit(msg(true)), async () => {
      await mess.react('1️⃣').catch(() => {});
      mess.edit(msg(false));
    });

    const reactionCol = mess.createReactionCollector(
      (reaction, user) => (reaction.emoji.id === eID.emojicoffeegears || reaction.emoji.name === '1️⃣') && user.id === message.author.id, { max: 1, time: 60000 }
    );

    const msgCol = mess.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { max: 1, time: 60000 });


    reactionCol.on('collect', () => {
      set(oldPrefix, defaultPrefix, message, permissions);
      reactionCol.stop();
      msgCol.stop();
    });

    msgCol.on('collect', (mensagem) => {
      if (mensagem.content.toLowerCase() === 'ok') set(oldPrefix, defaultPrefix, message, permissions);
      reactionCol.stop();
      msgCol.stop();
    }); 
  });
};