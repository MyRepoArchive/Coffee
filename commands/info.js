const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "info",
  name2: "botinfo",
  name3: "infobot",
  type: "Informativo",
  description: "Exibe para o usuário alguma informações bacanas do bot, como número de comandos, de usuários, de canais, servidores, etc...",

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const comandos = [...new Set(client.commands.map(comando => comando.name))]
    function pad(number, width) {
      number += ''
      return number.length >= width ? number : new Array(width - number.length + 1).join('0') + number;
    };
    const embedInfo = new Discord.MessageEmbed()
      .setColor(hex.darkred)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`<:info:745716823424630856> Informações sobre mim`)
      .addFields(
        { name: `Meu username`, value: client.user.username, inline: true },
        { name: `Meu apelido`, value: (botMembro.nickname === null || botMembro.nickname === undefined) ? 'Não tenho apelido nesse servidor' : botMembro.nickname, inline: true },
        { name: `Discriminator`, value: client.user.discriminator, inline: true },
        { name: `Tag`, value: client.user.tag, inline: true },
        { name: `Servidores`, value: `**${client.guilds.cache.size}**`, inline: true },
        { name: `Usuários`, value: `**${client.users.cache.size}**`, inline: true },
        { name: `Canais`, value: `**${client.channels.cache.size}**`, inline: true },
        { name: `Emojis`, value: `**${client.emojis.cache.size}**`, inline: true },
        { name: `Comandos`, value: `**${comandos.length}**`, inline: true },
        { name: `Meu prefixo`, value: `"\`${config.prefix}\`"`, inline: true },
        { name: `Servidor de suporte`, value: `[Clique aqui](https://discord.gg/hNffyc3)`, inline: true },
        { name: `Meu código-fonte`, value: `[Clique aqui](${config.repositorio})`, inline: true },
        { name: `Me adicione em seu servidor`, value: `[Clique aqui](https://discordapp.com/oauth2/authorize?=&client_id=${client.user.id}&scope=bot)`, inline: true },
        { name: `Fui criado em`, value: `${pad(client.user.createdAt.getDate(), 2)}/${pad(client.user.createdAt.getMonth()+1, 2)}/${client.user.createdAt.getFullYear()} às ${pad(client.user.createdAt.getHours(), 2)}:${pad(client.user.createdAt.getMinutes(), 2)}:${pad(client.user.createdAt.getSeconds(), 2)}`, inline: true },
        { name: `Entrei aqui em`, value: `${pad(botMembro.joinedAt.getDate(), 2)}/${pad(botMembro.joinedAt.getMonth()+1, 2)}/${botMembro.joinedAt.getFullYear()} às ${pad(botMembro.joinedAt.getHours(), 2)}:${pad(botMembro.joinedAt.getMinutes(), 2)}:${pad(botMembro.joinedAt.getSeconds(), 2)}`, inline: true },
        { name: `Os mestres que criaram os meus emojis`, value: `[Píxel Buddha](https://www.flaticon.com/authors/pixel-buddha)\n[Cole Bemis](https://www.iconfinder.com/colebemis)`, inline: true },
      )
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Sistema de informações ${client.user.username}`, client.user.displayAvatarURL())
      if(podeEnviarMsg) {
        message.channel.send(embedInfo)
      } else if(podeAddReactions) {
        message.react('alertcircle:745709428937981992')
      }
  }
}