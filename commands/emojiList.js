const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "emojilist",
  name2: "listadeemojis",
  name3: "listemoji",
  name4: "listemojis",
  type: "Informativo",
  description: `Mostra em uma embed todos os emojis e seus respectivos identifiers que o bot tem acesso!`,

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const emojiList = await client.emojis.cache.filter(emoji => !emoji.animated && emoji.guild.name.startsWith("Coffee EmojiServer") && emoji.guild.ownerID === config.owner).map(emoji => emoji.identifier)
    let result = [];
    let maior = 0;
    for(let i = 0; i < emojiList.length; i++) {
      result.push(`<:${emojiList[i]}> `)
      if(`<:${emojiList[i]}> `.length > maior) {
        maior = `<:${emojiList[i]}> `.length
      }
    }
    const embed = new Discord.MessageEmbed()
      .setColor(hex.brown)
      .setTitle(`Aqui estão os emojis que eu vejo`)
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
      .setTimestamp()
      for(let i = 0; i < Math.ceil(result.length*maior / 1024); i++) {
        if(i < 5) {
          embed.addField(`\u200b`, result.slice(Math.floor(1024/maior * i), Math.floor(1024/maior * (i + 1))).join(''))
        } else {i = Infinity}
      }
    message.channel.send(function(send) {
      let newEmbeds
      for(let i = 0; i < embeds.length; i++) {
        newEmbeds += embeds[i]
      }
      return newEmbeds
    })
  }
}