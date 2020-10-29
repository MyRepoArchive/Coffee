const client = require('../../..');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = (comando, message, prefix) => {
  const { moreSimilar } = require('../../../functions');
  const possibleNamesCommand = client.commands.map(command => command.config.aliases.concat([command.config.name]));
  const allAliases = [].concat(...possibleNamesCommand);
  const similarWord = moreSimilar(comando, allAliases);

  message.channel.send(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> Eu não conheço esse comando, use **${prefix}ajuda** para saber todos os meus comandos!\n` +
    `${similarWord && `> Você quis dizer: **${similarWord}**?`}`
  )
    .then(msg => msg.delete({ timeout: 5000 }), e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> Houve um erro ao enviar uma mensagem de que o comando não existe para um usuário!\n' +
      `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
      `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
      `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};