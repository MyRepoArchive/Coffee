const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')
const emojis = require('../emojis.json')

module.exports = {
  name: "mute",
  name2: "mutar",
  name3: "silenciar",
  name4: "silencie",
  name5: "calar",
  name6: "cale",
  type: "Moderação",
  description: `Impossibilita o usuário citado de falar no servidor!\nModo de usar:\n**Mencionando o usuário** *${config.prefix}mute @user*\n**Pelo username ou apelido:** *${config.prefix}mute username*`,

  async execute(message, args, comando, client, prefix) {
    const { run } = require('../utils/errorAlert.js')
    const membro = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0])
    if (!membro) {
      const descEmbed = new Discord.MessageEmbed()
        .setColor(hex.blue2)
        .setTitle(`<:${emojis.textchannelblockedclaro}> Como usar o ${prefix}${comando}`)
        .setDescription(`Modo de usar:\n**Mencionando o usuário** *${config.prefix}mute @user*\n**Pelo username ou apelido:** *${config.prefix}mute username*`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
      return run(message, client, descEmbed, emojis.alertcircleamarelo)
    }
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    const mutedRoles = await message.guild.roles.cache.find(role => role.permissions.bitfield === 1024)
    if (!message.member.hasPermission("MANAGE_ROLES") || !message.member.hasPermission("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> Você não pode mutar membros nesse servidor!`, emojis.slashred)
    if (!botMembro.hasPermission("MANAGE_ROLES") || !botMembro.hasPermission("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> Eu não tenho permissão para mutar membros!`, emojis.slashred)
    if (membro.id === message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> Ele é o dono do servidor, não posso fazer isso!`, emojis.slashred)
    if (membro.hasPermission("ADMINISTRATOR")) return run(message, client, ` <:${emojis.slashred}> Eu não posso mutar um **administrador**!`, emojis.slashred)
    if (membro.roles.highest.position >= botMembro.roles.highest.position) return run(message, client, ` <:${emojis.slashred}> Eu não posso mutar esse membro, ele tem um cargo maior que o meu!`, emojis.slashred)
    if (membro.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> Eu não posso mutar esse membro, ele tem um cargo maior que o seu!`, emojis.slashred)
    if (membro.user.id === client.user.id) return run(message, client, `<:${emojis.alertcircleamarelo}> Eu não posso me mutar no servidor, faça isso manualmente ou peça ajuda a outro bot!`, emojis.alertcircleamarelo)
    if (membro.user.id === message.author.id) return run(message, client, `<:${emojis.alertcircleamarelo}> Você não pode se mutar do servidor, isso é apenas questão de segurança!`, emojis.alertcircleamarelo)

    if (mutedRoles) {
      membro.roles.set([mutedRoles])
      message.guild.channels.cache.filter(canal => canal.memberPermissions(botMembro).has("MANAGE_ROLES") && canal.memberPermissions(botMembro).has("VIEW_CHANNEL")).map(canal => canal.createOverwrite(mutedRoles, { SEND_MESSAGES: false }))
    } else {
      message.guild.roles.create({ data: { name: "Muted", color: "#f5f5f5", hoist: false, mentionable: true, permissions: 1024 } }).then(role => {
        membro.roles.set([role])
        message.guild.channels.cache.filter(canal => canal.memberPermissions(botMembro).has("MANAGE_ROLES") && canal.memberPermissions(botMembro).has("VIEW_CHANNEL")).map(canal => canal.createOverwrite(role, { SEND_MESSAGES: false }, motivo))
      })
    }
    run(message, client, `<:${emojis.circlecheckverde}> **${membro.displayName}** foi mutado om sucesso!`, emojis.circlecheckverde)
  }
}