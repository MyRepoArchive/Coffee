const Discord = require('discord.js')

module.exports = {
  config: require('./src/config'),

  async run({ message, args, prefix }) {
    const { verifyActiveCooldown } = require('../../../functions');
    const { active, reason_inactivity, cooldownControl, cooldown, times_limit } = this.config;

    if (!verifyActiveCooldown(message, active, reason_inactivity, cooldownControl, cooldown, times_limit)) return;
    if (!args.length) {
      
    }

    const { run } = require('../utils/errorAlert.js')
    if(args.length === 0)return run(message, client, `<:${emojis.alertcircleamarelo}> Coloque algum conteúdo quando for fazer sua sugestão!`, emojis.alertcircleamarelo)
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