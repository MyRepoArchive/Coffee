const error = require('../../../../functions/error');
const { static, animated } = require('../../../../utils/emojis.json');

module.exports = async (message, embed) => {
  const sendingDmMsg = await message.channel.send(`> ${animated.emoji.loading2} Enviando...`).catch(e => error(
    `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
    '> Aconteceu um erro ao enviar uma mensagem de envio de eval!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));

  message.author.send(embed).then(
    () => sendingDmMsg && sendingDmMsg.edit(`> ${static.emoji.emojicoffeeenveloppe} Enviado.`).catch(() => { }),
    e => {
      sendingDmMsg && sendingDmMsg.edit(`> ${static.emoji.emojicoffeeerro} Erro!`).catch(() => { });

      error(
        `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
        '> Não foi possível enviar um eval para a DM de um usuário!\n' +
        `> Path: "${__filename}"\n` +
        `> Erro: "${JSON.stringify(e, null, 4)}"`
      );
    }
  );
};