const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "avatar",
  name2: "mostraravatar",
  name3: "fotodeperfil",
  name4: "imagemdeperfil",
  name5: "imagedeperfil",
  name6: "displayavatar",
  type: "Diversão",
  description: `Mostra para o usuário o avatar dele ou de outro membro do servidor\nModo de usar:\nMostrando o próprio avatar: *${config.prefix}avatar*\nMostrando o avatar de outro membro do servidor: *${config.prefix}avatar @membro*\nou: *${config.prefix}avatar usernameDoMembro*`,

  async execute(message, args, comando, client, prefix) {
    const mencoes = message.mentions.members
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const usernamesDigitados = message.content.trim().slice(prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const embed = new Discord.MessageEmbed()
      .setColor(hex.lemonchiffon)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(client.user.username, client.user.displayAvatarURL())
    if(podeEnviarMsg) {
      if(mencoes.size === 0) {
        if(usernamesDigitados[0] === '') {
          embed.setImage(message.author.displayAvatarURL({size: 1024, dynamic: true}))
          embed.setTitle(`Avatar de ${message.author.username}`)
          message.channel.send(embed)
        } else {
          for(let i = 0; i < usernamesDigitados.length; i++) {
            const usernameMembers = await message.guild.members.cache.filter(member => member.user.username.toLowerCase() === usernamesDigitados[i])
            const nicknameMembers = await message.guild.members.cache.filter(member => (member.nickname === null || member.nickname === undefined) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
            if(usernameMembers.size !== 0) {
              embed.setTitle(`Avatar de ${usernameMembers.map(member => member.user.username)[0]}`)
              embed.setImage(usernameMembers.map(member => member.user.displayAvatarURL({size: 1024, dynamic: true}))[0])
              message.channel.send(embed)
            } else if(nicknameMembers.size !== 0) {
              embed.setTitle(`Avatar de ${nicknameMembers.map(member => member.user.username)[0]}`)
              embed.setImage(nicknameMembers.map(member => member.user.displayAvatarURL({size: 1024, dynamic: true}))[0])
              message.channel.send(embed)
            } else if(i === usernamesDigitados.length - 1) {
              message.reply(`eu não conheço esse membro!`)
            }
          }
        }
      } else {
        embed.setTitle(`Avatar de ${mencoes.first().user.username}`)
        embed.setImage(mencoes.first().user.displayAvatarURL({size: 1024, dynamic: true}))
        message.channel.send(embed)
      }
    } else if(podeAddReactions) {
      message.react('alertcircleamarelo:747879938207514645')
    }
  }
}
