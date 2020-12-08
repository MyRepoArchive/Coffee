const client = require("../../../..");
const error = require("../../../../functions/error");
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');

module.exports = (message) => {
  const msg =
    `> ${emoji.emojicoffeeblock} Block!\n` +
    `> ${message.author}, você não tem permissão para utilizar esse comando!`

  const permissions = message.channel.permissionsFor(client.user);

  if (!permissions.has("SEND_MESSAGES")) return dm();

  message.channel.send(msg).catch(e => {
    dm();

    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> Houve um erro ao enviar uma mensagem em um canal!\n' +
      `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
      `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
      `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    );
  });

  function dm() {
    message.author.send(msg).catch(e => {
      if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro).catch(e => {
        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Houve um problema ao tentar adicionar uma reação em um comando.\n' +
          `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
          `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
          `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
          `> Path: "${__filename}"\n` +
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        );
      });
    });
  };
};