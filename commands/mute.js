const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "mute",
  name2: "mutar",
  name3: "silenciar",
  name4: "silencie",
  name5: "calar",
  name6: "cale",
  type: "Moderação",
  description: `Impossibilita o usuário citado de falar no servidor!\nModo de usar:\n**Mencionando o(s) usuário(s)** *${config.prefix}mute @user1 @user2*\n**Pelo username ou apelido:** *${config.prefix}mute username1 \\ apelido1*`,

  async execute(message, args, comando, client) {
    const mencoes = message.mentions
    const usernamesDigitados = message.content.trim().slice(config.prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    const podeManageRoles = permissoesBot.has("MANAGE_ROLES")
    if(mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          const descEmbed = new Discord.MessageEmbed()
            .setColor(hex.blue2)
            .setTitle(`Como usar o ${config.prefix}${comando}`)
            .setDescription(`Modo de usar:\n**Mencionando o(s) usuário(s)** *${config.prefix}mute @user1 @user2*\n**Pelo username ou apelido:** *${config.prefix}mute username1 \\ apelido1*`)
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
          message.reply(descEmbed)
        } else if (podeAddReactions) {
          message.react('helpcircle:745759636589903922')
        }
        return;
      } else {
        for(let i = 0; i < usernamesDigitados.length; i++) {
          const usernameMembers = await message.guild.members.cache.filter(member => member.user.username.toLowerCase() === usernamesDigitados[i])
          const nicknameMembers = await message.guild.members.cache.filter(member => (member.nickname === null) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
          if(usernameMembers.size !== 0) {
            
          } else if(nicknameMembers.size !== 0) {

          }
        }
      }
    }
  }
}