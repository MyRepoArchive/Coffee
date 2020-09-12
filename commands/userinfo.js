const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');
const { formatDate } = require('../utils/formatDate');

module.exports = {
  name: "userinfo",
  name2: "infouser",
  name3: "informacoesdousuario",
  name4: "informacoesdouser",
  name5: "useri",
  type: "Informativo",
  description: "Mostra informações do usuário que executou o comando ou do usuário mencionado!",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    let mentioned = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => args.length === 0 ? member === message.member : member.user.username.toLowerCase().includes(args.join(' ').toLowerCase())) || message.guild.members.cache.find(member => args.length === 0 ? member === message.member : member.displayName.toLowerCase().includes(args.join(' ').toLowerCase())) || message.guild.members.cache.get(args[0]) || message.member
    const statusEmoji = {
      online: emojis.disponivel,
      idle: emojis.ausente,
      dnd: emojis.naoperturbe,
      offline: emojis.offline
    }
    const status = {
      online: "Disponível",
      idle: "Ausente",
      dnd: "Não perturbe",
      offline: "Offline"
    }
    let roles = mentioned.roles.cache.map(role => role.id)
    if(roles.length > 5) roles = roles.slice(0, 5)
    let cargos = `<@&${roles.join('> \`|\` <@&')}>`
    if(mentioned.roles.cache.map(role => role.id).length > 5) cargos += '\`...\`'
    const entrou = await formatDate(mentioned.joinedAt)
    const contaCriada = await formatDate(mentioned.user.createdAt)
    let comumServers = client.guilds.cache.filter(server => server.member(mentioned.user)).map(x => x)
    if(comumServers.length > 10) comumServers = comumServers.slice(0, 10)
    let serversEmComum = `\`${comumServers.join('\`, \`')}\``
    if(client.guilds.cache.filter(server => server.member(mentioned.user)).map(x => x).length > 10) serversEmComum += ' \`...\`'
    const userinfoEmbed = new Discord.MessageEmbed()
      .setColor(mentioned.displayHexColor)
      .setAuthor(mentioned.displayName)
      .setTitle(`<:${emojis.infoblue}> Informações sobre ${mentioned.user.username}`)
      .setDescription(`<:${emojis.edit3blue}> Username: **${mentioned.user.username}**\n<:${emojis.nick}> Apelido: **${mentioned.nickname === null || mentioned.nickname === undefined ? 'Não possui apelido nesse servidor!' : mentioned.nickname}**\n<:${emojis.cardname}> ID: **${mentioned.id}**\n<:${emojis.tagfill}> Tag: **${mentioned.user.tag}**\n<:${statusEmoji[mentioned.user.presence.status]}> Status: **${status[mentioned.user.presence.status]}**`)
      .addFields(
        { name: `<:${emojis.cargos}> Cargos`, value: cargos },
        { name: `<:${emojis.datecalendar}> Datas`, value: `<:${emojis.dateconfirmcalendar}> Entrou em: **${entrou}**\n<:${emojis.datenewcalendar}> Conta criada em: **${contaCriada}**` },
        { name: `<:${emojis.hostingmigrationdatacenter}> Servidores em comum`, value: serversEmComum }
      )
      .setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
    run(message, client, userinfoEmbed, emojis.alertcircleamarelo)
  }
}