const Discord = require('discord.js')
const hex = require('../../colors.json')
const config = require('../../info.json')
const emojis = require('../../emojis.json')
const { verificaSemelhanca } = require('../utils/verificaSemelhanca')

module.exports = {
  name: "desc",
  aliases: ["descreva", "describe", "guia", "howtouse", "comousa", "comouso", "mododeusar", "mododeuso", "comousar"],
  type: "Geral",
  description: `Mostra a descrição de cada comando!\nModo de usar: **${config.prefix}desc kick**`,

  async execute(message, args, comando, client, prefix) {
    const { run } = require('../utils/errorAlert.js')

    const array = client.commands.map(x => x.aliases.concat([x.name]))
    let concated = []
    for (let i = 0; i < array.length; i++) {
      concated = concated.concat(array[i].concat(array[i + 1]))
    }

    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    const descEmbed = new Discord.MessageEmbed()
      .setColor(hex.blue2)
      .setTitle(`<:${emojis.helpcircleblue}> Descrição do comando ${prefix}${comando}`)
      .setDescription(`Modo de usar: **${prefix}desc kick**\nOBS: *O comando **${prefix}desc serve para descrever o comportamento de outros comandos e como usá-los.***`)
      .setTimestamp()
      .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
    if (args.length === 0) return run(message, client, descEmbed, emojis.alertcircleamarelo)
    if (args[0].startsWith(prefix)) args[0] = args[0].slice(prefix.length)
    
    if (!client.commands.has(args[0])) return run(message, client, `<:${emojis.alertcircleamarelo}> ${message.author}, o comando ***${args[0]}*** não existe!\nTalvez você esteja querendo saber do comando **${verificaSemelhanca(args[0], concated)}**`, emojis.alertcircleamarelo)
    const desc = client.commands.get(args[0]).description
    const embed = new Discord.MessageEmbed()
      .setColor(hex.gray)
      .setTitle(`<:${emojis.helpcircleblue}>  Descrição do comando **${args[0]}**`)
      .setTimestamp()
      .setFooter(`Sistema de descrição de comandos ${client.user.username}`, client.user.displayAvatarURL())
      .setDescription(desc)
    if (podeEnviarMsg) {
      message.reply(embed)
    } else {
      message.author.send(embed).then(() => {
        if (podeAddReactions) {
          message.react(emojis.send)
        }
      }, () => {
        if (podeAddReactions) {
          message.react(emojis.alertcircleamarelo)
        }
      })
    }
  }
}