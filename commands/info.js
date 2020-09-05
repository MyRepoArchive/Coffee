const Discord = require('discord.js') // Requerimento da library
const hex = require('../colors.json') // Requerimento do json de cores para facilitar contrução de embeds
const config = require('../info.json') // Requerimento do arquivo config para alguma configurações pré-definidas
const emojis = require('../emojis.json');
const osu = require('node-os-utils');
const formatDate = require('../utils/formatDate');

module.exports = { // Exporta o conteúdo do arquivo para outro arquivo
  name: "info",
  name2: "botinfo",
  name3: "infobot",
  type: "Informativo", // Tipo do comando para aparecer no HELP
  description: "Exibe para o usuário alguma informações bacanas do bot, como número de comandos, de usuários, de canais, servidores, etc...", // Descrição do comando para aparecer no HELP

  async execute(message, args, comando, client, prefix) { // Função que executa o código quando é chamada
    const botMembro = message.guild.member(client.user.id)
    const errorAlert = require('../utils/errorAlert.js')
    const comandos = [...new Set(client.commands.map(comando => comando.name))] // Array com todos os nomes dos comandos do bot
    const cpu = await osu.cpu.usage()
    const memory = (await osu.mem.used()).usedMemMb
    const totMemory = (await osu.mem.used()).totalMemMb
    const pad = require('../utils/pad.js')
    const criacao = await formatDate.formatDate(client.user.createdAt)
    const entrou = await formatDate.formatDate(botMembro.joinedAt)
    const embedInfo = new Discord.MessageEmbed()
      .setColor(botMembro.displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`<:${emojis.infoblue}> Informações sobre mim`)
      .setDescription(`<:${emojis.edit3blue}> Username: **${client.user.username}**\n<:${emojis.nick}> Apelido: **${(botMembro.nickname === null || botMembro.nickname === undefined) ? 'Não tenho apelido nesse servidor' : botMembro.nickname}**\n<:${emojis.cardname}> ID: **${client.user.id}**\n<:${emojis.tagfill}> Tag: **${client.user.tag}**`)
      .addFields( // Corpo da embed com o conteúdo importante
        { name: `<:${emojis.ddiscord}> Estatísticas Discord`, value: `<:${emojis.server2}> Servidores(**${client.guilds.cache.size}**)  <:${emojis.listademembros}> Usuários(**${client.users.cache.size}**)  <:${emojis.textchannelclaro}> Canais(**${client.channels.cache.size}**)  <:${emojis.emoji}> Emojis(**${client.emojis.cache.size}**)`, inline: true },
        { name: `<:${emojis.mensagensfixadas}> Interação`, value: `<:${emojis.terminal}> Comandos(**${comandos.length}**)  <:${emojis.p_}> Prefixo: "\`${prefix}\`"`, inline: true },
        { name: `<:${emojis.configuracoesdousuario}> Tecnologias utlizadas`, value: `<:${emojis.javascript}> **JavaScript**  <:${emojis.node}> **NodeJS**  <:${emojis.mysql}> **MySQL**`, inline: true },
        { name: `<:${emojis.hostinghyperlink}> Links`, value: `<:${emojis.hostingsupport}> [Servidor-de-suporte](https://discord.gg/hNffyc3)  <:${emojis.sourcecode}> [Código-fonte](${config.repositorio})  <:${emojis.convidarpessoas}> [Me-adicione](https://discordapp.com/oauth2/authorize?=&client_id=${client.user.id}&scope=bot)`, inline: true },
        { name: `<:${emojis.datecalendar}> Datas`, value: `<:${emojis.datenewcalendar}> Criação: **${criacao}** (${parseInt((Date.now()-client.user.createdTimestamp)/31536000000)} anos, ${parseInt(((Date.now()-client.user.createdTimestamp)%31536000000)/2628000000)} meses e ${parseInt((((Date.now()-client.user.createdTimestamp)%31536000000)%2628000000)/86400000)} dias)\n<:${emojis.datenewcalendar}> Entrei aqui: **${entrou}** (${parseInt((Date.now()-botMembro.joinedTimestamp)/31536000000)} anos, ${parseInt(((Date.now()-botMembro.joinedTimestamp)%31536000000)/2628000000)} meses e ${parseInt((((Date.now()-botMembro.joinedTimestamp)%31536000000)%2628000000)/86400000)} dias)`, inline: true },
        { name: `<:${emojis.hostinganalitic}> Estatísticas`, value: `<:${emojis.hostingfastnotebook}> Ping(**${Math.round(client.ws.ping)}ms**)  <:${emojis.dateampulheta}> Uptime: **${parseInt(client.uptime/3600000)}h e ${parseInt(client.uptime%3600000/60000)}min**  <:${emojis.eletricityraio}> Uso de CPU(**${cpu}%**)  <:${emojis.eletricitycoins}> Memória utilizada(**${memory}Gb/${totMemory}Gb**)` }
      )
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
      errorAlert.run(message, client, embedInfo, emojis.alertcircleamarelo)
  }
}