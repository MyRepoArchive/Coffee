const { static: { emoji, eID } } = require('../../utils/emojis.json');
const client = require('../..')

module.exports = (active, message, reasonInactivity) => {
  const { error } = require('..');
  const permissions = message.channel.permissionsFor(client.user);
  
  const msg =
    `> ${emoji.emojicoffeeinfo} Aviso!\n`+
    '> Este comando está desativado no momento!\n'+
    `> Motivo: ${reasonInactivity ? `"${reasonInactivity.toUpperCase()}"` : 'SEM MOTIVO INFORMADO'}`;

  if (!active) {
    if (permissions.has('SEND_MESSAGES')) {
      message.channel.send(msg)
        .catch(e => {
          dm();

          error(
            `> ${emoji.emojicoffeeinfo} Aviso!\n`+
            '> Houve um erro ao enviar um aviso de que o comando estava desativado.\n'+
            `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
            `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
            `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
            `> Path: "${__filename}"\n` +
            `> Erro: "${JSON.stringify(e, null, 4)}"`
          );
        });
    } else dm();

    return false;
  };

  return true;

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando que está desativado.\n'+
              `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
              `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
              `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
              `> Path: "${__filename}"\n` +
              `> Erro: "${JSON.stringify(e, null, 4)}"`
            );
          });
      });
  }
};