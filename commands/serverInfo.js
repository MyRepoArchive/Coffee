const Discord = require('discord.js') // Requerimento da library
const hex = require('../colors.json') // Requerimento do json de cores para facilitar construção de embeds
const config = require('../info.json') // Requerimento do arquivo config para algumas configurações pré-definidas

module.exports = { // Exporta conteúdo para o arquivo que o chama
  // Nomes possíveis de chamar o comando
  name: "serverinfo",
  name2: "infoserver",
  name3: "guildinfo",
  name4: "infoguild",
  name5: "serveri",
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
        { name: `<:paperfillgrayscale:749002694567657634> Descrição`, value: message.guild.description === null || message.guild.description === undefined || message.guild.description === "" ? "Sem descrição" : `"${message.guild.description}"`, inline: true },
        { name: `<:cardname:748331507118112778> ID do server`, value: message.guild.id, inline: true },
        { name: `:flag_white: Região`, value: `${regionsFlags[region]} ${region === "Brazil" ? "Brasil" : region}`, inline: true },
        { name: `<:verifield:748206756257202187> Verificado`, value: message.guild.verifield ? "Sim" : "Não", inline: true },
        { name: `<:messagesquareblue:747879951461777448> Canais`, value: `<:hash:745722860584173682> Total: **${guildChannels.size}**\n<:textchannelclaro:748224336770498650> Texto: **${guildTextChannels}**  <:voicechannelclaro:748224336825155614> Voz: **${guildVoiceChannels}**  <:newschannelclaro:748952970871177357> Notícias: **${guildNewsChannels}**  <:categoriaclaro:748956436779892746> Categoria: **${guildCategoryChannels}**  <:storechannelclaro:748952971097800795> Store: **${guildStoreChannels}**` },
        { name: `<:listademembros:748195187284770898> Membros`, value: `<:hash:745722860584173682> Total: **${message.guild.members.cache.size}**\n<:pessoa:748959007892439130> Pessoas: **${guildHumanMembers}**\n<:disponivel:748195170775990354> Online: **${guildOnlineMembers}**  <:ausente:748197530285899878> Ausente **${guildIdleMembers}**  <:naoperturbe:748195171090563245> Não perturbe: **${guildDndMembers}**  <:offline:748195187959791636> Offline: **${guildOfflineMembers}**  <:transmitindo:748195189939765269> Transmitindo: **${guildStreamingMembers}**\n<:botnoverifield:748195170889236610> Bots: **${guildBotMembers}**\n<:disponivel:748195170775990354> Online: **${guildOnlineBots}**  <:ausente:748197530285899878> Ausente **${guildIdleBots}**  <:naoperturbe:748195171090563245> Não perturbe: **${guildDndBots}**  <:offline:748195187959791636> Offline: **${guildOfflineBots}**  <:transmitindo:748195189939765269> Transmitindo: **${guildStreamingBots}**` },
        { name: `<:ownercoroa:748195170788311273> Dono do servidor`, value: `${message.guild.owner.user.tag} \`${message.guild.ownerID}\`\n${(message.guild.owner.nickname === null || message.guild.owner.nickname === undefined) ? '' : `Apelido: **${message.guild.owner.nickname}**`}`, inline: true },
        { name: `<:calendar:748344326408634379> Criado em`, value: `${criadoEm} (${parseInt((Date.now()-message.guild.createdTimestamp)/31536000000)} anos, ${parseInt(((Date.now()-message.guild.createdTimestamp)%31536000000)/2628000000)} meses e ${parseInt((((Date.now()-message.guild.createdTimestamp)%31536000000)%2628000000)/86400000)} dias)`, inline: true },
        { name: `<:configuracoesdousuario:748195176836497569> Admins`, value: `**${guildAdmins}**`, inline: true },
        { name: `<:boosterlv7:748214264497700969> Impulsos`, value: `**${message.guild.premiumSubscriptionCount}**`, inline: true },
        { name: `<:cargos:748987539364249621> Cargos`, value: `**${guildRolesCount}**`, inline: true },
        { name: `<:emoji:748334546138955826> Emojis`, value: `**${message.guild.emojis.cache.size}**`, inline: true },
      )
      .setThumbnail(message.guild.iconURL({dynamic: true}))
      .setTimestamp()
    if(podeEnviarMsg) { // Verifica se pode enviar mensagem
      message.channel.send(embed)
    } else if (podeAddReactions) { // Se não poder enviar mensagem, verifica se pode adicionar uma reação na mensagem
      message.react('alertcircleamarelo:747879938207514645')
    }
  }
}