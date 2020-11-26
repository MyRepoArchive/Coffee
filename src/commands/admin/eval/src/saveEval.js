const { static, animated } = require('../../../../utils/emojis.json');
const moment = require('moment');

module.exports = async (message, evalContent, embed) => {
  const { error } = require('../../../../functions');

  const savingMsg = await message.channel.send(`> ${animated.emoji.loading2} Salvando...`).catch(e => error(
    `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
    '> Aconteceu um erro ao enviar uma mensagem de salvamento de eval!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
  const name = `saved_eval_${moment().locale('pt-br').format('llll')}.txt`;
  const attachment = Buffer.from(
    '>>> Input <<<\n\n' +
    evalContent + '\n\n\n' +
    '>>> Output <<<\n\n' +
    embed.description
  );

  message.author.send({ files: [{ name, attachment }] }).then(
    () => savingMsg && savingMsg.edit(`> ${static.emoji.emojicoffeesave} Salvo.`).catch(() => {}),
    e => {
      savingMsg && savingMsg.edit(`> ${static.emoji.emojicoffeeerro} Erro!`).catch(() => {});

      error(
        `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
        '> Não foi possível enviar um saved_eval para a DM de um usuário!\n' +
        `> Path: "${__filename}"\n` +
        `> Erro: "${JSON.stringify(e, null, 4)}"`
      );
    }
  );
};