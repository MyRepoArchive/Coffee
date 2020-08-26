const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "serverinfo",
  name2: "infoserver",
  name3: "guildinfo",
  name4: "infoguild",
  type: "Informativo",
  description: "Mostra algumas informações sobre o servidor em que foi utilizado o comando",

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const guildChannels = message.guild.channels.cache
    const guildTextChannels = guildChannels.filter(channel => channel.type === 'text').size
    const guildVoiceChannels = guildChannels.filter(channel => channel.type === 'voice').size
    const guildNewsChannels = guildChannels.filter(channel => channel.type === 'news').size
    const guildStoreChannels = guildChannels.filter(channel => channel.type === 'store').size
    const guildCategoryChannels = guildChannels.filter(channel => channel.type === 'category').size
    const guildHumanMembers = message.guild.members.cache.filter(member => !member.user.bot).size
    const guildBotMembers = message.guild.members.cache.filter(member => member.user.bot).size
    const guildAdmins = message.guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.user.username).join('`, `')
    const guildRolesCount = message.guild.roles.cache.size
    const guildRolesNames = message.guild.roles.cache.map(role => role.name).join('`, `')
    function formatDate(date) {
      return `${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()} às ${(date.getUTCHours() < 3) ? date.getUTCHours()+21 : date.getUTCHours()-3}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor(hex.coral)
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
      .addFields(
        { name: `ID do server`, value: message.guild.id, inline: true },
        { name: `Região`, value: message.guild.region.toUpperCase(), inline: true },
        { name: `Quantidade de canais`, value: `Total: **${guildChannels.size}** | Texto: **${guildTextChannels}** | Voz: **${guildVoiceChannels}** | Notícias: **${guildNewsChannels}** | Categoria: **${guildCategoryChannels}** | Store: **${guildStoreChannels}**`, inline: true },
        { name: `Quantidade de membros`, value: `Total: **${message.guild.members.cache.size}** | Pessoas: **${guildHumanMembers}** | Bots: **${guildBotMembers}**`, inline: true },
        { name: `Dono do servidor`, value: `${message.guild.owner.user.tag} | **${message.guild.ownerID}**\n${(message.guild.owner.nickname === null || message.guild.owner.nickname === undefined) ? '' : `Apelido: **${message.guild.owner.nickname}**`}`, inline: true },
        { name: `Criado em`, value: formatDate(message.guild.createdAt), inline: true },
        { name: `Admins`, value: `\`${guildAdmins}\``, inline: true },
        { name: `Impulsos`, value: `**${message.guild.premiumSubscriptionCount}**`, inline: true },
        { name: `Cargos`, value: `**${guildRolesCount}**`, inline: true },
        { name: `Emojis`, value: `**${message.guild.emojis.cache.size}**`, inline: true },
      )
      .setThumbnail(message.guild.iconURL({dynamic: true}))
    if(podeEnviarMsg) {
      message.channel.send(embed)
    } else if (podeAddReactions) {
      message.react('alertcircleamarelo:747879938207514645')
    }
  }
}