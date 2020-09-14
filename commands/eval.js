const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "eval",
  aliases: ["ev", "e"],
  type: "Dev commands",
  description: "Eval!",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const evalContent = args.join(' ')
    const evalEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de ajuda em desenvolvimento ${client.user.username}`, client.user.displayAvatarURL())
    if(message.author.id !== config.owner) return run(message, client, `<:${emojis.slashred}> Você não pode usar esse tipo de comando!`, emojis.slashred)
    if(!evalContent) return run(message, client, `<:${emojis.alertcircleamarelo}> Insira um valor válido!`, emojis.alertcircleamarelo)
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
      const msg = await message.channel.send(evalEmbed)
      if(podeAddReactions) {
        msg.react(emojis.medialock)
        const filter = (react, user) => react.emoji.identifier === emojis.medialock && user.id === config.owner
        const collector = msg.createReactionCollector(filter, { time: 600000 })
        collector.on('collect', (react, user) => {
          msg.edit(`<:${emojis.medialock}> Este eval foi trancado!`, { embed: null })
          const reaction = msg.reactions.cache.find(react => react.emoji.identifier === emojis.medialock)
          if(reaction) reaction.users.remove(client.user.id)
        })
      }
    } else if(podeAddReactions) message.react(emojis.alertcircleamarelo)
  }
}