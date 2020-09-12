const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')
const emojis = require('../emojis.json')

module.exports = {
  name: "unmute",
  name2: "desmutar",
  name3: "dessilenciar",
  name4: "dessilencie",
  type: "Moderação",
  description: `Possibilita o usuário citado de falar no servidor novamente!\nModo de usar:\n**Mencionando o usuário** *${config.prefix}unmute @user*\n**Pelo username ou apelido:** *${config.prefix}unmute username*`,

  async execute(message, args, comando, client, prefix) {
    const { run } = require('../utils/errorAlert.js')
    const membro = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0])
    if (!membro) {
      const descEmbed = new Discord.MessageEmbed()
        .setColor(hex.blue2)
        .setTitle(`<:${emojis.textchannelclaro}> Como usar o ${prefix}${comando}`)
        .setDescription(`Modo de usar:\n**Mencionando o usuário** *${config.prefix}unmute @user*\n**Pelo username ou apelido:** *${config.prefix}unmute username*`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
      return run(message, client, descEmbed, emojis.alertcircleamarelo)
    }
    const botMembro = message.guild.member(client.user.id)
    const mutedRoles = await message.guild.roles.cache.find(role => role.permissions.bitfield === 1024)
    
    if (!message.member.hasPermission("MANAGE_ROLES") || !message.member.hasPermission("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não pode desmutar membros nesse servidor!`, emojis.slashred) // Verifica se o usuário possui permissão para banir membros
    if (!botMembro.hasPermission("MANAGE_ROLES") || !botMembro.hasPermission("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não tenho permissão para desmutar membros!`, emojis.slashred) // Verifica se o bot tem permissão para banir membros
    if (membro.roles.highest.position >= botMembro.roles.highest.position) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso desmutar esse membro, ele tem um cargo maior que o meu!`, emojis.slashred) // Verifica se o user citado tem um cargo maior que o do bot
    if (membro.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu não posso desmutar esse membro, ele tem um cargo maior que o seu!`, emojis.slashred) // Verifica se o user citado tem um cargo maior que o do membro 
    if (membro === message.member) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não pode se desmutar do servidor, isso é apenas questão de segurança!`, emojis.alertcircleamarelo) // Verifica se o user citado é o próprio member
    if(!membro.roles.cache.find(role => role === mutedRoles)) return run(message, client, `<:${emojis.xcirclered}> Esse membro não está mutado!`)
    
    await membro.roles.remove([mutedRoles])
    run(message, client, `<:${emojis.circlecheckverde}> **${membro.displayName}** foi desmutado com sucesso!`)
  }
}