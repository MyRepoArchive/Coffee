const { MessageEmbed } = require('discord.js');
const client = require('../../../..');
const chatOrDm = require('../../../../functions/chatOrDm');

module.exports = (category, message, permissions) => {
  const comandos = client.commands.filter(cmd => cmd.config.type.toLowerCase() === category.toLowerCase());

  const embed = new MessageEmbed()
    .setColor(message.member.displayHexColor)
    .setTitle(`Comandos do tipo **${category}** (${comandos.map(x => x).length})`)
    .setDescription(`${comandos.map(cmd => `**${cmd.config.name}** (\`${cmd.config.aliases.join('`, `')}\`)`).join('\n')}`)
    .setTimestamp()

  chatOrDm(embed, permissions, message);
};