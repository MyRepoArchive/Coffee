const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "sql",
  aliases: ["mysql", "mysqlquery", "sqlquery"],
  type: "Dev commands",
  description: "Realize uma query MySQL diretamente do discord!",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    const sql = args.join(' ')
    const sqlEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de ajuda em desenvolvimento ${client.user.username}`, client.user.displayAvatarURL())
    if (!config.owners.includes(message.author.id)) return run(message, client, `<:${emojis.slashred}> Você não pode usar esse tipo de comando!`, emojis.slashred)
    if (!sql) return run(message, client, `<:${emojis.alertcircleamarelo}> Insira um valor válido!`, emojis.alertcircleamarelo)
    connection.query(sql, async (err, result) => {
      if (err) {
        sqlEmbed.setColor(hex.orangered)
        sqlEmbed.setDescription(`\`\`\`${err}\`\`\``)
        if (podeEnviarMsg) {
          const mensagem = await message.channel.send(sqlEmbed)
          if (podeAddReactions) {
            mensagem.react(emojis.medialock)
            const filter = (react, user) => react.emoji.identifier === emojis.medialock && config.owners.includes(user.id)
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
          const filter = (react, user) => react.emoji.identifier === emojis.medialock && config.owners.includes(user.id)
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