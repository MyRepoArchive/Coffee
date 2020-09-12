const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')
const emojis = require('../emojis.json')

module.exports = {
  name: "sugerir",
  name2: "sugestao",
  type: "Contato com os desenvolvedores",
  description: `Se você gostaria de ver alguma nova funcionalidade no bot que ainda não tenha, ou qualquer tipo de feature, basta usar o comando para que os devenvolvedores fiquem a par da sugestão e possa prontamente atender aos seus pedidos.\nComo usar: ${config.prefix}sugerir sua sugestão vai aqui`,

  async execute(message, args, comando, client) {
    const sugestContent = args.join(' ')
    const sugestChannel = client.channels.cache.get(config.sugestoes)
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const sugestEmbed = new Discord.MessageEmbed()
      .setColor(hex.yellow) // Define a cor da barra lateral para amarelo
      .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL()) // Seta o author da embed como sendo o author da sugestão
      .setDescription(`\`\`\`${sugestContent}\`\`\``) // O conteúdo da sugestão é colocado dentro de um bloco de código na embed
      .setTimestamp()
      .setFooter(`Sistema de sugestões ${client.user.username}`, client.user.displayAvatarURL())
    await sugestChannel.send(sugestEmbed) // Envia a sugestão no canal específico de sugestões
    if(podeAddReactions) { // Verifica se pode adicionar reações no canal
      message.react(emojis.circlecheckverde).then(() => {
        message.react(emojis.send)
      })
    } else if(podeEnviarMsg) { // Se não poder, verifica se pode enviar mensagens no canal
      message.channel.send(`<:${emojis.circlecheckverde}> Pronto ${message.author}, sua sugestão foi enviada para análise!`)
    }
  }
}