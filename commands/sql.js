const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "sql",
  name2: "mysql",
  name3: "mysqlquery",
  name4: "sqlquery",
  type: "Dev commands",
  description: "Realize uma query MySQL diretamente do discord!",

  async execute(message, args, comando, client, prefix, connection) {
    const errorAlert = require('../utils/errorAlert.js')
    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    const sql = args.join(' ')
    const sqlEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de ajuda em desenvolvimento ${client.user.username}`, client.user.displayAvatarURL())
    if (message.author.id !== config.owner) return errorAlert.run(message, client, `<:slashred:747879954305253468> Você não pode usar esse tipo de comando!`, 'slashred:747879954305253468')
    if (!sql) return errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Insira um valor válido!`, 'alertcircleamarelo:747879938207514645')
    connection.query(sql, async (err, result) => {
      if (err) {
        sqlEmbed.setColor(hex.orangered)
        sqlEmbed.setDescription(`\`\`\`${err}\`\`\``)
        if (podeEnviarMsg) {
          const mensagem = await message.channel.send(sqlEmbed)
          if (podeAddReactions) {
            mensagem.react(emojis.medialock)
            const filter = (react, user) => react.emoji.identifier === emojis.medialock && user.id === config.owner
            const collector = mensagem.createReactionCollector(filter, { time: 600000 })
            collector.on('collect', (react, user) => {
              mensagem.edit(`<:${emojis.medialock}> Esta query foi trancada!`, { embed: null })
              const reaction = mensagem.reactions.cache.find(react => react.emoji.identifier === emojis.medialock)
              if (reaction) reaction.users.remove(client.user.id)
            })
          }
        } else if(podeAddReactions) {
          message.react(emojis.alertcircleamarelo)
        }
        return;
      }
      sqlEmbed.setColor(hex.gray)
      sqlEmbed.setDescription(`\`\`\`${JSON.stringify(result).slice(0, 2020)}\`\`\``)
      if (podeEnviarMsg) {
        const mensagem = await message.channel.send(sqlEmbed)
        if (podeAddReactions) {
          mensagem.react(emojis.medialock)
          const filter = (react, user) => react.emoji.identifier === emojis.medialock && user.id === config.owner
          const collector = mensagem.createReactionCollector(filter, { time: 600000 })
          collector.on('collect', (react, user) => {
            mensagem.edit(`<:${emojis.medialock}> Esta query foi trancada!`, { embed: null })
            const reaction = mensagem.reactions.cache.find(react => react.emoji.identifier === emojis.medialock)
            if (reaction) reaction.users.remove(client.user.id)
          })
        }
      } else if(podeAddReactions) {
        message.react(emojis.alertcircleamarelo)
      }
    })
  }
}