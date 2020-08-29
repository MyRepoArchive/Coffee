const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "report",
  name2: "reportar",
  type: "Contato com os desenvolvedores",
  description: `Se você encontrou algum bug ou coisa que você acredita que não esteja funcionando como deveria, basta usar o comando para que os devenvolvedores fiquem a par do problema e o resolva.\nComo usar: ${config.prefix}report seu report vai aqui`,

  async execute(message, args, comando, client) {
    const reportContent = args.join(' ')
    const reportChannel = client.channels.cache.get(config.report)
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const reportEmbed = new Discord.MessageEmbed()
      .setColor(hex.yellow) // Define a cor da barra lateral para amarelo
      .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL()) // Seta o author da embed como sendo o author do report
      .setDescription(`\`\`\`${reportContent}\`\`\``) // O conteúdo do report é colocado dentro de um bloco de código na embed
      .setTimestamp()
      .setFooter(`Sistema de reports ${client.user.username}`, client.user.displayAvatarURL())
    await reportChannel.send(reportEmbed) // Envia o report no canal específico de reports
    if(podeAddReactions) { // Verifica se pode adicionar reações no canal
      message.react('circlecheckverde:747879943224033481').then(() => {
        message.react('send:745271212799950899')
      })
    } else if(podeEnviarMsg) { // Se não poder, verifica se pode enviar mensagens no canal
      message.channel.send(`<:circlecheckverde:747879943224033481> Pronto ${message.author}, seu report foi enviado com sucesso!`)
    }
  }
}