const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "botusers",
  name2: "usersbot",
  type: "Informativo",
  description: "Mostra a quantidade de usuários que o bot está tendo acesso",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    const onlineUsers = client.users.cache.filter(user => user.presence.status === 'online').size
    const idleUsers = client.users.cache.filter(user => user.presence.status === 'idle').size
    const offlineUsers = client.users.cache.filter(user => user.presence.status === 'offline').size
    const dndUsers = client.users.cache.filter(user => user.presence.status === 'dnd').size
    const streamingUsers = client.users.cache.filter(user => user.presence.activities.filter(activity => activity.type === "STREAMING").length > 0).size
    const usersEmbed = new Discord.MessageEmbed()
      .setColor(message.guild.member(client.user).displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`<:${emojis.listademembros}> Total: **${client.users.cache.size}**`)
      .setDescription(`**<:${emojis.pessoa}> Pessoas: ${client.users.cache.filter(user => !user.bot).size}  <:${emojis.botnoverifield}> Bots: ${client.users.cache.filter(user => user.bot).size}**\n<:${emojis.disponivel}> Disponíveis: ${onlineUsers}\n<:${emojis.ausente}> Ausentes: ${idleUsers}\n<:${emojis.naoperturbe}> Não perturbe: ${dndUsers}\n<:${emojis.offline}> Offline: ${offlineUsers}\n<:${emojis.transmitindo}> Transmitindo: ${streamingUsers}`)
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
    run(message, client, usersEmbed, emojis.alertcircleamarelo)
  }
}