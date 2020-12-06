const client = require('../../..');
const error = require('../../../functions/error');
const { static: { emoji, eID } } = require('../../../utils/emojis.json');

module.exports = async (permissions, message, comando, e) => {
  const invite = permissions.has("CREATE_INSTANT_INVITE") ? await message.channel.createInvite({
    maxAge: 0,
    reason: `Houve um erro ao executar um comando do bot ${client.user.tag} e os administradores precisam ser chamados para averiguar o problema`
  }) : null;

  error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao executar um comando!\n' +
    `> Comando: "${comando}"\n` +
    `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n`+
    `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n`+
    `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n`+
    `${invite && `> Convite: "https://discord.gg/${invite.code}"\n`}` +
    `> Path: "${__filename}"\n` +
    `> Erro: "${e.stack}"`
  );

  const msg = 
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao executar este comando. A equipe já foi informada e se necessário entrará em contato!';

  if (permissions.has("SEND_MESSAGES")) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Houve um erro ao enviar um aviso para um usuário!\n' +
          `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n`+
          `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n`+
          `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n`+
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
              '> Houve um problema ao tentar adicionar uma reação em um comando.\n'+
              `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
              `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
              `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
              `> Path: "${__filename}"\n`+
              `> Erro: "${JSON.stringify(e, null, 4)}"`
            );
          });
      });
  };
}