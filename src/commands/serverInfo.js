const Discord = require('discord.js') // Requerimento da library
const hex = require('../colors.json') // Requerimento do json de cores para facilitar construção de embeds
const config = require('../info.json') // Requerimento do arquivo config para algumas configurações pré-definidas
const emojis = require('../emojis.json')

module.exports = { // Exporta conteúdo para o arquivo que o chama
  // Nomes possíveis de chamar o comando
  name: "serverinfo",
  aliases: ["infoserver","guildinfo", "infoguild", "serveri"],
  type: "Informativo", // Tipo do comando
  description: "Mostra algumas informações sobre o servidor em que foi utilizado o comando", // Descrição do comando

  async execute(message, args, comando, client) { // Função que executa o código chamado pela index
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
    const guildMembers = message.guild.members.cache
    const guildHumanMembers = guildMembers.filter(member => !member.user.bot).size
    const guildOnlineMembers = guildMembers.filter(member => member.user.presence.status === 'online' && !member.user.bot).size
    const guildIdleMembers = guildMembers.filter(member => member.user.presence.status === 'idle' && !member.user.bot).size
    const guildOfflineMembers = guildMembers.filter(member => member.user.presence.status === 'offline' && !member.user.bot).size
    const guildDndMembers = guildMembers.filter(member => member.user.presence.status === 'dnd' && !member.user.bot).size
    const guildStreamingMembers = guildMembers.filter(member => member.user.presence.activities.filter(activity => activity.type === "STREAMING").length > 0 && !member.user.bot).size
    const guildBotMembers = guildMembers.filter(member => member.user.bot).size
    const guildOnlineBots = guildMembers.filter(member => member.user.presence.status === 'online' && member.user.bot).size
    const guildIdleBots = guildMembers.filter(member => member.user.presence.status === 'idle' && member.user.bot).size
    const guildOfflineBots = guildMembers.filter(member => member.user.presence.status === 'offline' && member.user.bot).size
    const guildDndBots = guildMembers.filter(member => member.user.presence.status === 'dnd' && member.user.bot).size
    const guildStreamingBots = guildMembers.filter(member => member.user.presence.activities.filter(activity => activity.type === "STREAMING").length > 0 && member.user.bot).size
    const guildAdmins = guildMembers.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.user.username).join('**, **')
    const guildRolesCount = message.guild.roles.cache.size
    const region = message.guild.region.slice(0, 1).toUpperCase() + message.guild.region.slice(1)
    const regionsFlags = { // Bandeiras de todas as regiões do discord
      "Brazil": ":flag_br:",
      "Us-west": ":flag_us:",
      "Us-east": ":flag_us:",
      "Us-central": ":flag_us:",
      "Us-south": ":flag_us:",
      "Singapore": ":flag_sg:",
      "South-africa": ":united_nations:",
      "Sydney": ":flag_au:",
      "Europe": ":united_nations:",
      "Honk-kong": ":flag_hk:",
      "Russia": ":flag_ru:",
      "Japan": ":flag_jp:",
      "India": ":united_nations:"
    }
    const { formatDate } = require('../utils/formatDate.js')
    const criadoEm = await formatDate(message.guild.createdAt)
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor(hex.coral)
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
      .addFields( // Corpo da embed com todas as informações relevantes
        { name: `<:${emojis.paperfillgrayscale}> Descrição`, value: message.guild.description === null || message.guild.description === undefined || message.guild.description === "" ? "Sem descrição" : `"${message.guild.description}"`, inline: true },
        { name: `<:${emojis.cardname}> ID do server`, value: message.guild.id, inline: true },
        { name: `:flag_white: Região`, value: `${regionsFlags[region]} ${region === "Brazil" ? "Brasil" : region}`, inline: true },
        { name: `<:${emojis.verifield}> Verificado`, value: message.guild.verifield ? "Sim" : "Não", inline: true },
        { name: `<:${emojis.messagesquareblue}> Canais`, value: `<:${emojis.hash}> Total: **${guildChannels.size}**\n<:${emojis.textchannelclaro}> Texto: **${guildTextChannels}**  <:${emojis.voicechannelclaro}> Voz: **${guildVoiceChannels}**  <:${emojis.newschannelclaro}> Notícias: **${guildNewsChannels}**  <:${emojis.categoriaclaro}> Categoria: **${guildCategoryChannels}**  <:${emojis.storechannelclaro}> Store: **${guildStoreChannels}**` },
        { name: `<:${emojis.listademembros}> Membros`, value: `<:${emojis.hash}> Total: **${message.guild.members.cache.size}**\n<:${emojis.pessoa}> Pessoas: **${guildHumanMembers}**\n<:${emojis.disponivel}> Online: **${guildOnlineMembers}**  <:${emojis.ausente}> Ausente **${guildIdleMembers}**  <:${emojis.naoperturbe}> Não perturbe: **${guildDndMembers}**  <:${emojis.offline}> Offline: **${guildOfflineMembers}**  <:${emojis.transmitindo}> Transmitindo: **${guildStreamingMembers}**\n<:${emojis.botnoverifield}> Bots: **${guildBotMembers}**\n<:${emojis.disponivel}> Online: **${guildOnlineBots}**  <:${emojis.ausente}> Ausente **${guildIdleBots}**  <:${emojis.naoperturbe}> Não perturbe: **${guildDndBots}**  <:${emojis.offline}> Offline: **${guildOfflineBots}**  <:${emojis.transmitindo}> Transmitindo: **${guildStreamingBots}**` },
        { name: `<:${emojis.ownercoroa}> Dono do servidor`, value: `${message.guild.owner.user.tag} \`${message.guild.ownerID}\`\n${(message.guild.owner.nickname === null || message.guild.owner.nickname === undefined) ? '' : `Apelido: **${message.guild.owner.nickname}**`}`, inline: true },
        { name: `<:${emojis.calendar}> Criado em`, value: `${criadoEm} (${parseInt((Date.now()-message.guild.createdTimestamp)/31536000000)} anos, ${parseInt(((Date.now()-message.guild.createdTimestamp)%31536000000)/2628000000)} meses e ${parseInt((((Date.now()-message.guild.createdTimestamp)%31536000000)%2628000000)/86400000)} dias)`, inline: true },
        { name: `<:${emojis.configuracoesdousuario}> Admins`, value: `**${guildAdmins}**`, inline: true },
        { name: `<:${emojis.boosterlv7}> Impulsos`, value: `**${message.guild.premiumSubscriptionCount}**`, inline: true },
        { name: `<:${emojis.cargos}> Cargos`, value: `**${guildRolesCount}**`, inline: true },
        { name: `<:${emojis.emoji}> Emojis`, value: `**${message.guild.emojis.cache.size}**`, inline: true },
      )
      .setThumbnail(message.guild.iconURL({dynamic: true}))
      .setTimestamp()
    if(podeEnviarMsg) { // Verifica se pode enviar mensagem
      message.channel.send(embed)
    } else if (podeAddReactions) { // Se não poder enviar mensagem, verifica se pode adicionar uma reação na mensagem
      message.react(emojis.alertcircleamarelo)
    }
  }
}