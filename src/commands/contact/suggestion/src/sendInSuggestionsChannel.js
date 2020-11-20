const { suggestion_analise } = require('../../../../config/default.json');
const client = require('../../../..');
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const { lightstategray } = require('../../../../utils/colors.json');
const Discord = require('discord.js');

module.exports = (suggestionContent, message, createdTimestamp, id) => {
  const { error } = require('../../../../functions');
  const channel = client.channels.cache.get(suggestion_analise);

  if (!channel) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> O canal de suggestions que foi setado como padrão não foi encontrado!\n' +
    `> Path: "${__filename}"`
  );

  if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> O bot não tem permissão para enviar mensagens no canal que foi definido como o canal de suggestions!\n' +
    `> Path: "${__filename}"`
  );

  if (!channel.permissionsFor(client.user).has("ADD_REACTIONS")) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> O bot não têm permissão para adicionar reações no canal que foi definido como o canal de suggestions!\n' +
    `> Path: "${__filename}"`
  );

  const suggestionEmbed = new Discord.MessageEmbed()
    .setColor(lightstategray)
    .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL())
    .setTitle(id)
    .setDescription(suggestionContent)
    .setTimestamp(createdTimestamp)
    .setFooter(`Canal: "${message.channel.id}". Servidor: "${message.channel.guild.id}"`);

  channel.send(suggestionEmbed)
    .then(msg => {
      msg.react(eID.emojicoffeecheck);
      msg.react(eID.emojicoffeeerro);
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n`+
      '> Houve um erro ao enviar um novo suggestion no canal de suggestions!\n'+
      `> O suggestion: "${suggestionContent}"\n` +
      `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
      `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
      `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
      `> Path: "${__filename}"\n`+
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};