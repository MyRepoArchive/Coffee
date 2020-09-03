const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');

module.exports = {
  name: "eval",
  name2: "ev",
  name3: "e",
  type: "Dev commands",
  description: "Eval!",

  async execute(message, args, comando, client, prefix, connection) {
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const evalContent = args.join(' ')
    const evalEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de ajuda em desenvolvimento ${client.user.username}`, client.user.displayAvatarURL())
    if(message.author.id !== config.owner) {
      if(podeEnviarMsg) {
        message.channel.send('<:slashred:747879954305253468> Você não pode usar esse tipo de comando!')
      } else if (podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
    if(!evalContent) {
      if(podeEnviarMsg) {
        message.channel.send(`<:alertcircleamarelo:747879938207514645> Insira um valor válido!`)
      } else if(podeAddReactions) {
        message.react('alertcircleamarelo:747879938207514645')
      }
      return;
    }
    try {
      evalEmbed.setColor(hex.gray)
      evalEmbed.addFields(
        { name: '<:login:745708185611927553> Input', value: `\`\`\`${evalContent}\`\`\`` },
        { name: '<:logout:745708185540886688> Output', value:  `\`\`\`${`${eval(evalContent)}`.slice(0, 1000)}\`\`\``}
      )
    } catch (err) {
      evalEmbed.setColor(hex.orangered)
      evalEmbed.addFields(
        { name: '<:login:745708185611927553> Input', value: `\`\`\`${evalContent}\`\`\`` },
        { name: '<:logout:745708185540886688> Output', value: `\`\`\`${err}\`\`\`` }
      )
    }
    
    if(podeEnviarMsg) {
      message.channel.send(evalEmbed)
    } else if(podeAddReactions) {
      message.react('alertcircleamarelo:747879938207514645')
    }
  }
}