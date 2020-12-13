const error = require('../../../functions/error');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = (message, prefix) => {
  message.channel.send(`> Alguém me chamou? Se estiver precisando de ajuda, use **${prefix}ajuda**`).catch(e => error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Houve um erro ao responser um usuário quando mencionou o bot\n' +
    `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
    `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
    `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
};