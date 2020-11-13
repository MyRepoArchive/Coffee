const { report_analise } = require('../../../../config/default.json');
const client = require('../../../..');
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const { lightstategray } = require('../../../../utils/colors.json');
const Discord = require('discord.js');

module.exports = (reportContent, message, createdTimestamp) => {
  const { error } = require('../../../../functions');
  const channel = client.channels.cache.get(report_analise);

  if (!channel) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> O canal de reports que foi setado como padrão não foi encontrado!\n' +
    `> Path: "${__filename}"`
  );

  if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> O bot não tem permissão para enviar mensagens no canal que foi definido como o canal de reports!\n' +
    `> Path: "${__filename}"`
  );

  if (!channel.permissionsFor(client.user).has("ADD_REACTIONS")) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> O bot não têm permissão para adicionar reações no canal que foi definido como o canal de reports!\n' +
    `> Path: "${__filename}"`
  )

  const reportEmbed = new Discord.MessageEmbed()
    .setColor(lightstategray)
    .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL())
    .setDescription(reportContent)
    .setTimestamp(createdTimestamp)
    .setFooter(`Canal: "${message.channel.id}". Servidor: "${message.channel.guild.id}"`);

  channel.send(reportEmbed)
    .then(msg => {
      msg.react(eID.emojicoffeecheck);
      msg.react(eID.emojicoffeeerro);
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n`+
      '> Houve um erro ao enviar um novo report no canal de reports!\n'+
      `> O report: "${reportContent}"\n` +
      `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
      `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
      `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
      `> Path: "${__filename}"\n`+
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};