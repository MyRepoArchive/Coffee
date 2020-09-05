const Discord = require('discord.js') // Requerimento da library
const hex = require('../colors.json') // Requerimento do json de cores para facilitar contrução de embeds
const config = require('../info.json') // Requerimento do arquivo config para alguma configurações pré-definidas

module.exports = { // Exporta o conteúdo do arquivo para outro arquivo
  name: "info",
  name2: "botinfo",
  name3: "infobot",
  type: "Informativo", // Tipo do comando para aparecer no HELP
  description: "Exibe para o usuário alguma informações bacanas do bot, como número de comandos, de usuários, de canais, servidores, etc...", // Descrição do comando para aparecer no HELP

  async execute(message, args, comando, client, prefix) { // Função que executa o código quando é chamada
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const comandos = [...new Set(client.commands.map(comando => comando.name))] // Array com todos os nomes dos comandos do bot
    function pad(number, width) { // Função importada do index.js
      number += ''
      return number.length >= width ? number : new Array(width - number.length + 1).join('0') + number;
    };
    const embedInfo = new Discord.MessageEmbed()
      .setColor(botMembro.displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`<:infoblue:747879943987265607> Informações sobre mim`)
      .setDescription(`<:edit3blue:747879944369209344> Username: **${client.user.username}**\n<:nick:748331507315245086> Apelido: **${(botMembro.nickname === null || botMembro.nickname === undefined) ? 'Não tenho apelido nesse servidor' : botMembro.nickname}**\n<:cardname:748331507118112778> ID: **${client.user.id}**\n<:tagfill:748332391084589066> Tag: **${client.user.tag}**`)
      .addFields( // Corpo da embed com o conteúdo importante
        { name: `<:ddiscord:751096767704989847> Estatísticas Discord`, value: `<:server2:748333276443181168> Servidores(**${client.guilds.cache.size}**)  <:listademembros:748195187284770898> Usuários(**${client.users.cache.size}**)  <:textchannelclaro:748224336770498650> Canais(**${client.channels.cache.size}**)  <:emoji:748334546138955826> Emojis(**${client.emojis.cache.size}**)`, inline: true },
        { name: `<:mensagensfixadas:748195183174353086> Interação`, value: `<:terminal:745279127195615343> Comandos(**${comandos.length}**)  <:p_:748336334044790814> Prefixo: "\`${prefix}\`"`, inline: true },
        { name: `<:configuracoesdousuario:748195176836497569> Tecnologias utlizadas`, value: `<:javascript:748195182767374417> **JavaScript**  <:node:748195195748614154> **NodeJS**  <:mysql:748195192124735660> **MySQL**`, inline: true },
        { name: `<:anchor:745735266802597999> Links`, value: `<:support:748337028541710446> [Servidor-de-suporte](https://discord.gg/hNffyc3)  <:sourcecode:748338362569588788> [Código-fonte](${config.repositorio})  <:convidarpessoas:748959007573540956> [Me-adicione](https://discordapp.com/oauth2/authorize?=&client_id=${client.user.id}&scope=bot)`, inline: true },
        { name: `<:calendar:748344326408634379> Datas`, value: `<:calendar:748344326408634379> Criação: **${pad(client.user.createdAt.getDate(), 2)}/${pad(client.user.createdAt.getMonth()+1, 2)}/${client.user.createdAt.getFullYear()} às ${pad(client.user.createdAt.getHours(), 2)}:${pad(client.user.createdAt.getMinutes(), 2)}:${pad(client.user.createdAt.getSeconds(), 2)}**\n<:calendar:748344326408634379> Entrei aqui: **${pad(botMembro.joinedAt.getDate(), 2)}/${pad(botMembro.joinedAt.getMonth()+1, 2)}/${botMembro.joinedAt.getFullYear()} às ${pad(botMembro.joinedAt.getHours(), 2)}:${pad(botMembro.joinedAt.getMinutes(), 2)}:${pad(botMembro.joinedAt.getSeconds(), 2)}**`, inline: true },
        { name: '<:activity:745653942763126804> Estatísticas', value: `<:clock:745654651969601588> Ping(**${Math.round(client.ws.ping)}ms**)  <:togglerigthverde:747879943068713101> Uptime: **${parseInt(client.uptime/3600000)}h e ${parseInt(client.uptime%3600000/60000)}min**` }
      )
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
      if(podeEnviarMsg) { // Verifica se pode enviar mensagens
        message.channel.send(embedInfo)
      } else if(podeAddReactions) { // Se não poder, verifica se pode adicionar reações
        message.react('alertcircleamarelo:747879938207514645')
      }
  }
}