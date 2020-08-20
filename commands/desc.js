const Discord = require('discord.js')
const hex  = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "desc",
  name2: "descreva",
  name3: "describe",
  name4: "guia",
  name5: "howtouse",
  name6: "comousa",
  name7: "comouso",
  name8: "mododeusar",
  name9: "mododeuso",
  type: "Geral",
  description: `Mostra a descrição de cada comando!\nModo de usar: **${config.prefix}desc kick**`,

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    if(args.length === 0) {
      if(podeEnviarMsg) {
        const descEmbed = new Discord.MessageEmbed()
          .setColor(hex.blue2)
          .setTitle(`Descrição do comando ${config.prefix}${comando}`)
          .setDescription(`Modo de usar: **${config.prefix}desc kick**\nOBS: *O comando **${config.prefix}desc serve para descrever o comportamento de outros comandos e como usá-los.***`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
        message.reply(descEmbed)
      } else if(podeAddReactions) {
        message.react('helpcircle:745759636589903922')
      }
      return
    }
    if(args[0].startsWith(config.prefix)) {
      args[0] = args[0].slice(config.prefix.length)
    }
    if(!client.commands.has(args[0])) {
      if(podeEnviarMsg) {
        message.reply(`o comando ***${args[0]}*** não existe!`)
      } else if (podeAddReactions) {
        message.react('alertcircle:745709428937981992')
      }
      return
    }
    const desc = client.commands.get(args[0]).description
    const embed = new Discord.MessageEmbed()
      .setColor(hex.purple)
      .setTitle(`Descrição do comando **${args[0]}**`)
      .setTimestamp()
      .setFooter(`Sistema de descrição de comandos ${client.user.username}`, client.user.displayAvatarURL())
      .setDescription(desc)
    if(podeEnviarMsg) {    
      message.reply(embed)
    } else {
      message.author.send(embed).then(() => {
        if(podeAddReactions) {
          message.react('send:745271212799950899')
        }
      }, () => {
        if(podeAddReactions) {
          message.react('alertcircle:745709428937981992')
        }
      })
    }
  }
}