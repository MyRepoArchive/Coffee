const Discord = require('discord.js') // Requerimento da library
const hex = require('../colors.json') // Requerimento do json de cores para facilitar contrução de embeds
const config = require('../info.json') // Requerimento do arquivo config para alguma configurações pré-definidas

module.exports = { // Exporta o conteúdo do arquivo para outro arquivo
  name: "info",
  name2: "botinfo",
  name3: "infobot",
  type: "Informativo", // Tipo do comando para aparecer no HELP
  description: "Exibe para o usuário alguma informações bacanas do bot, como número de comandos, de usuários, de canais, servidores, etc...", // Descrição do comando para aparecer no HELP

  async execute(message, args, comando, client) { // Função que executa o código quando é chamada
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
      .setColor(hex.darkred)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`<:infoblue:747879943987265607> Informações sobre mim`)
      .addFields( // Corpo da embed com o conteúdo importante
        { name: `<:edit3blue:747879944369209344> Meu username`, value: client.user.username, inline: true },
        { name: `<:nick:748331507315245086> Meu apelido`, value: (botMembro.nickname === null || botMembro.nickname === undefined) ? 'Não tenho apelido nesse servidor' : botMembro.nickname, inline: true },
        { name: `<:cardname:748331507118112778> ID`, value: client.user.id, inline: true },
        { name: `<:taghashfill:748332391164018849> Discriminator`, value: client.user.discriminator, inline: true },
        { name: `<:tagfill:748332391084589066> Tag`, value: client.user.tag, inline: true },
        { name: `<:server2:748333276443181168> Servidores`, value: `**${client.guilds.cache.size}**`, inline: true },
        { name: `<:listademembros:748195187284770898> Usuários`, value: `**${client.users.cache.size}**`, inline: true },
        { name: `<:textchannelclaro:748224336770498650> Canais`, value: `**${client.channels.cache.size}**`, inline: true },
        { name: `<:emoji:748334546138955826> Emojis`, value: `**${client.emojis.cache.size}**`, inline: true },
        { name: `<:terminal:745279127195615343> Comandos`, value: `**${comandos.length}**`, inline: true },
        { name: `<:configuracoesdousuario:748195176836497569> Tecnologias utlizadas`, value: `<:javascript:748195182767374417> JavaScript <:node:748195195748614154> NodeJS`, inline: true },
        { name: `<:p_:748336334044790814> Meu prefixo`, value: `"\`${config.prefix}\`"`, inline: true },
        { name: `<:support:748337028541710446> Servidor de suporte`, value: `[Clique aqui](https://discord.gg/hNffyc3)`, inline: true },
        { name: `<:sourcecode:748338362569588788> Meu código-fonte`, value: `[Clique aqui](${config.repositorio})`, inline: true },
        { name: `<:convidarpessoas:748959007573540956> Me adicione em seu servidor`, value: `[Clique aqui](https://discordapp.com/oauth2/authorize?=&client_id=${client.user.id}&scope=bot)`, inline: true },
        { name: `<:calendar:748344326408634379> Fui criado em`, value: `${pad(client.user.createdAt.getDate(), 2)}/${pad(client.user.createdAt.getMonth()+1, 2)}/${client.user.createdAt.getFullYear()} às ${pad(client.user.createdAt.getHours(), 2)}:${pad(client.user.createdAt.getMinutes(), 2)}:${pad(client.user.createdAt.getSeconds(), 2)}`, inline: true },
        { name: `<:calendar:748344326408634379> Entrei aqui em`, value: `${pad(botMembro.joinedAt.getDate(), 2)}/${pad(botMembro.joinedAt.getMonth()+1, 2)}/${botMembro.joinedAt.getFullYear()} às ${pad(botMembro.joinedAt.getHours(), 2)}:${pad(botMembro.joinedAt.getMinutes(), 2)}:${pad(botMembro.joinedAt.getSeconds(), 2)}`, inline: true },
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