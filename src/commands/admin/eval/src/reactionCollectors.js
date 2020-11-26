const { static, animated } = require('../../../../utils/emojis.json');
const moment = require('moment');

module.exports = (msg, message, evalContent, embed) => {
  const { error } = require('../../../../functions');

  // Coletor para apagar o conteúdo do eval!
  msg.createReactionCollector((react, user) => react.emoji.id === static.eID.emojicoffeetrashrecycling && user.id === message.author.id, { time: 600000 })
    .on('collect', () => msg.edit(`> ${static.emoji.emojicoffeetrashrecycling} Deletado!`, { embed: null }).catch(e => error(
      `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
      '> Não foi possível editar um eval, para deletá-lo!\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    )));

  // Coletor para salvar o conteúdo do eval!
  msg.createReactionCollector((react, user) => react.emoji.id === static.eID.emojicoffeesave && user.id === message.author.id, { time: 600000 })
    .on('collect', async () => {
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
    });

  // Coletor para enviar o eval na dm do usuário
  msg.createReactionCollector((react, user) => react.emoji.id === static.eID.emojicoffeeenveloppe && user.id === message.author.id, { time: 600000 })
    .on('collect', async () => {
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
    });
};