const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "commandlist",
  name2: "listacomandos",
  name3: "listadecomandos",
  type: "Informativo",
  description: `Exibe em uma Embed uma lista com o nome prímário de todos os comandos do bot!`,

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const comandos = [...new Set(client.commands.map(comando => comando.name))]
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor(hex.ivory)
      .setTitle(`<:terminalblue:747879940749393951> Minha listinha de comandos (${comandos.length})`)
      .setDescription(`\`${comandos.join('`, `')}\``)
      .addField(`<:infoblue:747879943987265607> Observação`, `Se você estiver precisando de algo mais detalhado, use **${config.prefix}desc nomeDoComando** ou **${config.prefix}ajuda**`)
      .setTimestamp()
      .setFooter(client.user.username, client.user.displayAvatarURL())
    if(podeEnviarMsg) {
      message.channel.send(embed)
    } else {
      message.author.send(embed).then(() => {
        if(podeAddReactions) {
          message.react('circlecheckverde:747879943224033481')
        }
      }, () => {
        if(podeAddReactions) {
          message.react('alertcircleamarelo:747879938207514645')
        }
      })
    }
  }
}