const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const client = require('../../../..');
const error = require('../../../../functions/error');

module.exports = (message, prefix) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Você deve passar como parâmetro do comando a sua sugestão!\n' +
    `> Use \`${prefix}help sugerir\` para saber mais de como usar o comando!\n` +
    '> Status: "NÃO CRIADO"';

  const permissions = message.channel.permissionsFor(client.user);

  // Verifica se o bot tem permissão para enviar mensagem no canal
  if (permissions.has("SEND_MESSAGES")) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Houve um erro ao enviar um aviso de falta de parâmetros.\n' +
          `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
          `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
          `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
          `> Path: "${__filename}"\n` +
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        );
      });
  } else dm();

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando que foi mal utilizado por um usuário!\n' +
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