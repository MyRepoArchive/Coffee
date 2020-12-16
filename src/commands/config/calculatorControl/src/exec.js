const change = require('./change');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const chatOrDm = require('../../../../functions/chatOrDm');
const error = require('../../../../functions/error');

module.exports = (all, enable, message, permissions, allGuilds) => {
  change(message.channel.id, enable, all, allGuilds).then(changedChannels => {
    chatOrDm(`> ${emoji.emojicoffeecheck} Check!\n` +
      `> Foi alterada a permissão para a calculadora automática em ${changedChannels.length} ${changedChannels.length > 1 ? 'canais' : 'canal'}, para \`${enable ? 'PERMITIDO' : 'NÃO PERMITIDO'}\`!`, permissions, message);
  }, e => {
    chatOrDm(`> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao mudar a permissão da calculadora automática, os responsáveis já foram notificados e se preciso, entrarão em contato.`, permissions, message);
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      `> Houve um erro ao atualizar as permissões da calculadora altomática em um dos servidores.\n` +
      `> Path: "${__filename}"\n` +
      `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
      `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
      `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
      `> Erro: "${e}"`
    );
  });
};