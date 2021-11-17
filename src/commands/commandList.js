const Discord = require('discord.js')
const hex = require('../../colors.json')
const config = require('../../info.json')
const emojis = require('../../emojis.json');

module.exports = {
  name: "commandlist",
  aliases: ["listacomandos", "listadecomandos"],
  type: "Informativo",
  description: `Exibe em uma Embed uma lista com o nome prímário de todos os comandos do bot!`,

  async execute(message, args, comando, client, prefix) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const comandos = [...new Set(client.commands.filter((comando) => comando.type !== 'Dev commands').map((comando) => comando.name))]
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor(hex.gray21)
      .setTitle(`<:${emojis.terminalblue}> Minha listinha de comandos (${comandos.length})`)
      .setDescription(`\`${comandos.join('`, `')}\``)
      .addField(`<:${emojis.infoblue}> Observação`, `Se você estiver precisando de algo mais detalhado, use **${prefix}desc nomeDoComando** ou **${prefix}ajuda**`)
      .setTimestamp()
      .setFooter(client.user.username, client.user.displayAvatarURL())
    if(podeEnviarMsg) {
      message.channel.send(embed)
    } else {
      message.author.send(embed).then(() => {
        if(podeAddReactions) {
          message.react(emojis.circlecheckverde)
        }
      }, () => {
        if(podeAddReactions) {
          message.react(emojis.alertcircleamarelo)
        }
      })
    }
  }
}