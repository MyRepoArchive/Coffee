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
    connection.query(`select welcome_channel, welcome_color_embed, welcome_title_embed, welcome_thumbnail_embed, welcome_description_embed, welcome_footer_embed from servers where serverid = '${member.guild.id}'`, (err, result) => {
      if(err) throw err;
      
      if(result[0].welcome_channel !== null) {

        const embedPropertyes = {
          color: result[0].welcome_color_embed === null ? 'RANDOM' : result[0].welcome_color_embed,
          title: result[0].welcome_title_embed === null ? `<:${emojis.login}> Seja bem vindo ${member.displayName}! Nós do(a) ${member.guild.name} somos gratos pela sua aparição por aqui!` : result[0].welcome_title_embed.replace('${name}', member.displayName).replace('${server}', member.guild.name).replace('${tag}', member.user.tag).replace('${id}', member.id).replace('${memberCount}', member.guild.memberCount).replace('${username}', member.user.username).replace('${status}', member.user.status),
          thumbnail: result[0].welcome_thumbnail_embed === null ? member.user.displayAvatarURL() : result[0].welcome_thumbnail_embed,
          description: result[0].welcome_description_embed === null ? `<:${emojis.cardname}>Username: ${member.user.username}\n<:${emojis.nick}>ID: ${member.id}\n<:${emojis.convidarpessoasclaro}> Membro de número: ${member.guild.memberCount}` : result[0].welcome_description_embed.replace('${name}', member.displayName).replace('${server}', member.guild.name).replace('${tag}', member.user.tag).replace('${id}', member.id).replace('${memberCount}', member.guild.memberCount).replace('${username}', member.user.username).replace('${status}', member.user.status),
          footer: result[0].welcome_footer_embed === null ? `Sistema de boas vindas ${client.user.username}` : result[0].welcome_footer_embed.replace('${name}', member.displayName).replace('${server}', member.guild.name).replace('${tag}', member.user.tag).replace('${id}', member.id).replace('${memberCount}', member.guild.memberCount).replace('${username}', member.user.username).replace('${status}', member.user.status),
        }
  
        const welcomeEmbed = new  Discord.MessageEmbed()
          .setColor(embedPropertyes.color)
          .setTitle(embedPropertyes.title)
          .setThumbnail(embedPropertyes.thumbnail)
          .setDescription(embedPropertyes.description)
          .setFooter(embedPropertyes.footer, client.user.displayAvatarURL())
  
        const channel = member.guild.channels.cache.get(result[0].welcome_channel)

        if(!channel) return;

        const podeEnviarMsg = channel.memberPermissions(channel.guild.me).has("SEND_MESSAGES")

        if(!podeEnviarMsg) return;

        channel.send(welcomeEmbed)
      }

      
    })
  }
}