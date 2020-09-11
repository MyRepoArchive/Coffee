const config = require('../info.json')
const hex = require('../colors.json')
const Discord = require('discord.js')
const emojis = require('../emojis.json')

module.exports = {
  name: "ban",
  name2: "banir",
  type: "Moderação",
  description: `Bane o usuário mencionado do servidor!\nModo de usar:\n**Mencionando o usuário:** *${config.prefix}ban @member*\n**Pelo username ou apelido:** *${config.prefix}ban username*`,

  async execute(message, args, comando, client, prefix) {
    const { run } = require('../utils/errorAlert.js')
    const membro = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0])
    if (!membro) {
      const descEmbed = new Discord.MessageEmbed()
        .setColor(hex.blue2)
        .setTitle(`<:${emojis.chute}> Como usar o ${prefix}${comando}`)
        .setDescription(`Modo de usar:\n**Mencionando o usuário:** *${prefix}ban @member*\n**Pelo username ou apelido:** *${prefix}ban username*`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
      return run(message, client, descEmbed, emojis.alertcircleamarelo)
    }
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")

    if (!message.member.hasPermission("BAN_MEMBERS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não pode banir membros nesse servidor!`, emojis.slashred) // Verifica se o usuário possui permissão para banir membros
    if (!botMembro.hasPermission("BAN_MEMBERS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não tenho permissão para banir membros!`, emojis.slashred) // Verifica se o bot tem permissão para banir membros
    if (membro.user.id === message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> ${message.author}, ele é o dono do servidor, não posso fazer isso!`, emojis.slashred) // Verifica se o user citado é o dono do servidor
    if (membro.roles.highest.position >= botMembro.roles.highest.position) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso banir esse membro, ele tem um cargo maior que o meu!`, emojis.slashred) // Verifica se o user citado tem um cargo maior que o do bot
    if (membro.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso banir esse membro, ele tem um cargo maior que o seu!`, emojis.slashred) // Verifica se o user citado tem um cargo maior que o do membro 
    if (membro.user.id === client.user.id) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso me banir do servidor, faça isso manualmente ou peça ajuda a outro bot!`, emojis.alertcircleamarelo) // Verifica se o user citado é o bot
    if (membro === message.member) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não pode se banir do servidor, isso é apenas questão de segurança!`, emojis.alertcircleamarelo) // Verifica se o user citado é o próprio member
    if (podeEnviarMsg && podeAddReactions) {
      const embedMotivo = new Discord.MessageEmbed()
        .setColor(hex.orangered)
        .setTitle(`<:${emojis.helpcircleblue}> Deseja adiciona um motivo ao banimento?`)
      const embedDias = new Discord.MessageEmbed()
        .setColor(hex.orangered)
        .setTitle(`<:${emojis.datecalendarday}> Selecione a quantidade de dias para que as mensagens de **${membro.user.tag}** sejam deletadas!`)
      const embedConlusao = new Discord.MessageEmbed()
        .setColor(hex.lightstategray)
        .setTitle(`<:${emojis.circlecheckverde}> **${membro.user.tag}** foi banido com sucesso!`)
      const embedNegacao = new Discord.MessageEmbed()
        .setColor(hex.lightstategray)
        .setTitle(`<:${emojis.xcirclered}> Banimento cancelado!`)
      const msgMotivo = await message.channel.send(embedMotivo)
      await msgMotivo.react(emojis.xcirclered)
      await msgMotivo.react(emojis.circlecheckverde)
      const filterMotivoReactions = (reaction, user) => reaction.me && user.id === message.author.id
      const collectorReactionMotivo = msgMotivo.createReactionCollector(filterMotivoReactions, { max: 1, time: 10000 })
      collectorReactionMotivo.on('collect', (reaction, user) => {
        async function daysAndBan(motivo) {
          if (!motivo) motivo = ''
          msgMotivo.edit(embedDias)
          msgMotivo.reactions.cache.filter(reaction => reaction.emoji.identifier === emojis.xcirclered || reaction.emoji.identifier === emojis.circlecheckverde).map(reaction => reaction.users.remove(client.user.id))
          await msgMotivo.react(emojis.number0blue)
          await msgMotivo.react(emojis.number1blue)
          await msgMotivo.react(emojis.number2blue)
          await msgMotivo.react(emojis.number3blue)
          await msgMotivo.react(emojis.number4blue)
          await msgMotivo.react(emojis.number5blue)
          await msgMotivo.react(emojis.number6blue)
          await msgMotivo.react(emojis.number7blue)
          await msgMotivo.react(emojis.xcirclered)
          const filterDias = (reaction, user) => reaction.me && user.id === message.author.id
          const collectorDias = msgMotivo.createReactionCollector(filterDias, { max: 1, time: 10000 })
          collectorDias.on('collect', (reaction, user) => {
            if (reaction.emoji.identifier === emojis.number0blue) membro.ban({ days: 0, reason: motivo });
            if (reaction.emoji.identifier === emojis.number1blue) membro.ban({ days: 1, reason: motivo });
            if (reaction.emoji.identifier === emojis.number2blue) membro.ban({ days: 2, reason: motivo });
            if (reaction.emoji.identifier === emojis.number3blue) membro.ban({ days: 3, reason: motivo });
            if (reaction.emoji.identifier === emojis.number4blue) membro.ban({ days: 4, reason: motivo });
            if (reaction.emoji.identifier === emojis.number5blue) membro.ban({ days: 5, reason: motivo });
            if (reaction.emoji.identifier === emojis.number6blue) membro.ban({ days: 6, reason: motivo });
            if (reaction.emoji.identifier === emojis.number7blue) membro.ban({ days: 7, reason: motivo });
            if (reaction.emoji.identifier === emojis.xcirclered) return msgMotivo.edit(embedNegacao)
            msgMotivo.edit(embedConlusao)
          })
        } 
        if (user.id !== message.author.id || !reaction.me) return;
        if (reaction.emoji.identifier === emojis.xcirclered) {
          daysAndBan()
        } else if(reaction.emoji.identifier === emojis.circlecheckverde){
          const embed = new Discord.MessageEmbed()
            .setTitle(`Digite abaixo o motivo do banimento!`)
            .setColor(hex.orangered)
          msgMotivo.edit(embed)
          const filter = msg => msg.author.id === message.author.id
          const collector = message.channel.createMessageCollector(filter, { time: 20000, max: 1 })
          collector.on('collect', msg => {
            daysAndBan(msg.content)
          })
        }
      })
    } else {
      await membro.ban()
      run(message, client, `<:${emojis.circlecheckverde}> **${membro.user.tag}** foi banido com sucesso!`, emojis.circlecheckverde)
      if (podeManageMessages) message.delete()
    }
  }
}