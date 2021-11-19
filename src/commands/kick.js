const config = require('../../info.json')
const Discord = require('discord.js')
const hex = require('../../colors.json')
const emojis = require('../../emojis.json')

module.exports = {
  name: "kick",
  aliases: ["chutar", "chute", "kickar", "expulse", "expulsar"],
  type: "Moderação",
  description: `Expulsa o usuário mencionado do servidor!\nModo de usar:\n**Mencionando o usuário:** *${config.prefix}kick @member*\n**Pelo username ou apelido:** *${config.prefix}kick username*`,

  async execute(message, args, comando, client, prefix) {
    const { run } = require('../utils/errorAlert.js')
    const membro = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0])
    if (!membro) {
      const descEmbed = new Discord.MessageEmbed()
        .setColor(hex.blue2)
        .setTitle(`<:${emojis.chute}> Como usar o ${prefix}${comando}`)
        .setDescription(`Modo de usar:\n**Mencionando o usuário:** *${config.prefix}kick @member*\n**Pelo username ou apelido:** *${config.prefix}kick username*`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
      return run(message, client, descEmbed, emojis.alertcircleamarelo)
    }
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")

    if (!message.member.hasPermission("KICK_MEMBERS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não pode chutar membros nesse servidor!`, emojis.slashred) // Verifica se o usuário possui permissão para banir membros
    if (!botMembro.hasPermission("KICK_MEMBERS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não tenho permissão para chutar membros!`, emojis.slashred) // Verifica se o bot tem permissão para banir membros
    if (membro.user.id === message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> ${message.author}, ele é o dono do servidor, não posso fazer isso!`, emojis.slashred) // Verifica se o user citado é o dono do servidor
    if (membro.roles.highest.position >= botMembro.roles.highest.position) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso chutar esse membro, ele tem um cargo maior que o meu!`, emojis.slashred) // Verifica se o user citado tem um cargo maior que o do bot
    if (membro.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso chutar esse membro, ele tem um cargo maior que o seu!`, emojis.slashred) // Verifica se o user citado tem um cargo maior que o do membro 
    if (membro.user.id === client.user.id) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso me chutar do servidor, faça isso manualmente ou peça ajuda a outro bot!`, emojis.alertcircleamarelo) // Verifica se o user citado é o bot
    if (membro === message.member) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não pode se chutar do servidor, isso é apenas questão de segurança!`, emojis.alertcircleamarelo) // Verifica se o user citado é o próprio member
    
    if (podeEnviarMsg && podeAddReactions) {
      const embedMotivo = new Discord.MessageEmbed()
        .setColor(hex.orangered)
        .setTitle(`<:${emojis.helpcircleblue}> Deseja adiciona um motivo à expulsão?`)
      const embedConclusao = new Discord.MessageEmbed()
        .setColor(hex.lightstategray)
        .setTitle(`<:${emojis.circlecheckverde}> **${membro.user.tag}** foi expulso com sucesso!`)
      const embedNegacao = new Discord.MessageEmbed()
        .setColor(hex.lightstategray)
        .setTitle(`<:${emojis.xcirclered}> Expulsão cancelada!`)
      const msgMotivo = await message.channel.send(embedMotivo)
      await msgMotivo.react(emojis.xcirclered)
      await msgMotivo.react(emojis.circlecheckverde)
      const filterMotivoReactions = (reaction, user) => reaction.me && user.id === message.author.id
      const collectorReactionMotivo = msgMotivo.createReactionCollector(filterMotivoReactions, { max: 1, time: 10000 })
      collectorReactionMotivo.on('collect', async (reaction, user) => {
        if (user.id !== message.author.id || !reaction.me) return;
        if (reaction.emoji.identifier === emojis.xcirclered) {
          await membro.kick()
          msgMotivo.edit(embedConclusao)
        } else if(reaction.emoji.identifier === emojis.circlecheckverde){
          const embed = new Discord.MessageEmbed()
            .setTitle(`Digite abaixo o motivo da expulsão!`)
            .setColor(hex.orangered)
          msgMotivo.edit(embed)
          const filter = msg => msg.author.id === message.author.id
          const collector = message.channel.createMessageCollector(filter, { time: 20000, max: 1 })
          collector.on('collect', async msg => {
            await membro.kick(msg.content)
            msgMotivo.edit(embedConclusao)
          })
          collector.on('end', end => {
            msgMotivo.edit(embedNegacao)
          })
        }
      })
    } else {
      await membro.ban()
      run(message, client, `<:${emojis.circlecheckverde}> **${membro.user.tag}** foi expulso com sucesso!`, emojis.circlecheckverde)
      if (podeManageMessages) message.delete()
    }
  }
}