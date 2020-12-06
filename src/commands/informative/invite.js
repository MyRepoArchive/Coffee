const Discord = require('discord.js')
const config = require('../info.json')
const hex = require('../colors.json')
const emojis = require('../emojis.json')

module.exports = {
  name: "invite",
  aliases: ["convite"],
  type: "Geral",
  description: `Meu link de convite para me adicionar em algum outro servidor`,

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const embedInvite = new Discord.MessageEmbed()
      .setColor(hex.lightstategray)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Aqui está meu link de convite para me adicionar em seu servidor!`)
      .addFields(
        { name: `Convite sem permissões pré-definidas!`, value: `[Clique aqui](https://discordapp.com/oauth2/authorize?=&client_id=${client.user.id}&scope=bot)` },
        { name: `Convite com permissão de **Administrador** pré definida!`, value: `[Clique aqui](https://discordapp.com/oauth2/authorize?=&client_id=${client.user.id}&scope=bot&permissions=8)` }
      )
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Sistema de invites ${client.user.username}`, client.user.displayAvatarURL())
    if(podeEnviarMsg) {
      message.channel.send(embedInvite)
    } else {
      message.author.send(embedInvite).then(msg => {
        if(podeAddReactions) {
          message.react(emojis.circlecheckverde)
        }
      }, () => {
        if(podeAddReactions) {
          message.react(emojis.alertcircleamarelo)
        }
      })
    }
  }
}