const client = require('../../..');
const { log } = require('../../../config/default.json');
const { static: { emoji } } = require('../../../utils/emojis.json');
const { lightstategray } = require('../../../utils/colors.json');
const { error } = require('../../../functions');
const Discord = require('discord.js');

module.exports = () => {
  client.channels.fetch(log)
    .then(channel => {
      const readyEmbed = new Discord.MessageEmbed()
        .setColor(lightstategray)
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setTitle(`${emoji.emojicoffeecheck} Start`)
        .setDescription(
          `Usuários: ${client.users.cache.size}\n` +
          `Canais: ${client.channels.cache.size}\n` +
          `Servidores: ${client.guilds.cache.size}`
        )
        .setTimestamp();

      if (channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
        channel.send(readyEmbed)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n`+
              '> O bot encontrou um problema ao tentar enviar o log de largada no canal predefinido para logs!\n'+
              `> Erro: "${e}"`
            );
          });
      } else error(
        `> ${emoji.emojicoffeeinfo} Aviso!\n`+
        '> O bot não possui permissão de enviar mensagens no canal predefinido para logs'
      );
      
    })
    .catch(e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n`+
      '> O bot não conseguiu encontrar o canal predefinido para logs!\n'+
      `> Erro: "${e}"`
    ));
};