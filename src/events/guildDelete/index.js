const { log } = require('../../config/default.json');
const client = require('../..');
const Discord = require('discord.js');
const { lightstategray } = require('../../utils/colors.json');
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require('../../functions/error');

module.exports = (guild) => {
  client.channels.fetch(log)
    .then(channel => {
      const embed = new Discord.MessageEmbed()
        .setColor(lightstategray)
        .setTitle(`Saí do servidor ${guild.name}`)
        .addFields(
          { name: 'Descrição', value: guild.description || 'SEM DESCRIÇÃO' },
          { name: "ID", value: guild.id },
          { name: "População", value: guild.memberCount },
          { name: "Owner", value: `${guild.owner.user.tag} \`${guild.ownerID}\`` }
        )
        .setThumbnail(guild.iconURL())
        .setTimestamp()

      if (channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
        channel.send(embed)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> O bot encontrou um problema ao tentar enviar o log de que saiu de um servidor no canal predefinido para logs!\n' +
              `> Path: "${__filename}"\n` +
              `> Erro: "${JSON.stringify(e, null, 4)}"`
            );
          });
      } else error(
        `> ${emoji.emojicoffeeinfo} Aviso!\n` +
        '> O bot não possui permissão de enviar mensagens no canal predefinido para logs\n' +
        `> Path: "${__filename}"`
      );
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> O bot não conseguiu encontrar o canal predefinido para logs!\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};