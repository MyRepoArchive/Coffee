const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')
const emojis = require('../emojis.json')

module.exports = {
  name: "deletechannel",
  aliases: ["deletarcanal", "deletecanal", "excluircanal", "excluacanal", "excluirchannel", "apagarcanal", "apaguecanal", "deletechannels", "deletarcanais", "deletecanais", "excluircanais", "excluacanais", "excluirchannels", "apagarcanais", "apaguecanais"], 
  type: "Gerenciamento",
  description: `Você pode utilizar esse comando para deletar um canal de algum servidor que você tenha a devida permissão.\nModo de usar:\nMencionando o canal: *${config.prefix}deletechannel #nome-do-canal-1 #nome-do-canal-2*\nDitando o ID do canal: *${config.prefix}deletechannel id_do_canal_1 id_do_canal_2*`,

  async execute(message, args, comando, client, prefix) {
    const { run } = require('../utils/errorAlert.js')
    const channel = message.mentions.channels.first() || message.guild.channels.cache.find(channel => channel.name.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase().includes(args.join(' ').toLowerCase()))
    const descEmbed = new Discord.MessageEmbed()
      .setColor(hex.blue2)
      .setTitle(`<:${emojis.textchannelblockedclaro}> Como usar o ${prefix}${comando}`)
      .setDescription(`Modo de usar:\nMencionando o canal: *${prefix}deletechannel #nome-do-canal*\nDitando o ID do canal: *${prefix}deletechannel id_do_canal*\nUsando o nome do canal: *${prefix}deletechannel nome-do-canal*`)
      .setTimestamp()
      .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
    if (!channel) return run(message, client, descEmbed, emojis.helpcircleblue)
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    if (!channel.memberPermissions(botMembro).has("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> Eu não tenho permissão para deletar esse canal!`, emojis.slashred)
    if (!channel.memberPermissions(message.member).has("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> Você não tenho permissão para deletar esse canal!`, emojis.slashred)
    await channel.delete()
    run(message, client, `<:${emojis.circlecheckverde}> O canal ${channel.name} deletado com sucesso!`)
  }
}