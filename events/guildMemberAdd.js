const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json')
const pad = require('../utils/pad.js')
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
const changeActivity = require('../utils/changeActivity.js')
const emojis = require('../emojis.json');

module.exports = {
  name: 'guildMemberAdd',

  async execute(client, member, connection) {

    const welcome = await require('../utils/getWelcomeChannel.js').getCacheWelcomeChannel(client, member, connection)

    if(welcome.welcome_channel !== null) {

      const embedPropertyes = {
        color: welcome.welcome_color_embed === null ? 'RANDOM' : welcome.welcome_color_embed,
        title: welcome.welcome_title_embed === null ? `<:${emojis.login}> Seja bem vindo ${member.displayName}! Nós do(a) ${member.guild.name} somos gratos pela sua aparição por aqui!` : welcome.welcome_title_embed.replace('${name}', member.displayName).replace('${server}', member.guild.name).replace('${tag}', member.user.tag).replace('${id}', member.id).replace('${memberCount}', member.guild.memberCount).replace('${username}', member.user.username).replace('${status}', member.user.presence.status),
        thumbnail: welcome.welcome_thumbnail_embed === null ? member.user.displayAvatarURL() : welcome.welcome_thumbnail_embed,
        description: welcome.welcome_description_embed === null ? `<:${emojis.cardname}>Username: ${member.user.username}\n<:${emojis.nick}>ID: ${member.id}\n<:${emojis.convidarpessoasclaro}> Membro de número: ${member.guild.memberCount}` : welcome.welcome_description_embed.replace('${name}', member.displayName).replace('${server}', member.guild.name).replace('${tag}', member.user.tag).replace('${id}', member.id).replace('${memberCount}', member.guild.memberCount).replace('${username}', member.user.username).replace('${status}', member.user.presence.status),
        footer: welcome.welcome_footer_embed === null ? `Sistema de boas vindas ${client.user.username}` : welcome.welcome_footer_embed.replace('${name}', member.displayName).replace('${server}', member.guild.name).replace('${tag}', member.user.tag).replace('${id}', member.id).replace('${memberCount}', member.guild.memberCount).replace('${username}', member.user.username).replace('${status}', member.user.presence.status),
      }

      const welcomeEmbed = new  Discord.MessageEmbed()
        .setColor(embedPropertyes.color)
        .setTitle(embedPropertyes.title)
        .setThumbnail(embedPropertyes.thumbnail)
        .setDescription(embedPropertyes.description)
        .setFooter(embedPropertyes.footer, client.user.displayAvatarURL())

      const channel = member.guild.channels.cache.get(welcome.welcome_channel)

      if(!channel) return;

      const podeEnviarMsg = channel.memberPermissions(channel.guild.me).has("SEND_MESSAGES")

      if(!podeEnviarMsg) return;

      channel.send(welcomeEmbed)
    }
  }
}