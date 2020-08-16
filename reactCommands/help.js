const Discord = require('discord.js');
const config = require('../info.json');
const hex = require('../colors.json');

module.exports = {
  name: '0️⃣',
  name2: '1️⃣',
  name3: '2️⃣',
  name4: '3️⃣',
  name5: '4️⃣',
  name6: '5️⃣',
  name7: '6️⃣',
  name8: '7️⃣',
  name9: '8️⃣',
  name10: '9️⃣',
  name11: '🔟',
  name12: '⏪',
  name13: '⏩',
  description: 'help',

  async execute(message, user, client) {
    if(message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title === `Central de atendimento ${client.user.username}`) {
      const tiposComandos = [...new Set(client.commands.map(comando => comando.type))]
      const emojiArray = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('(') + 1).split('').shift())
      const oldEmbed = new Discord.MessageEmbed()
        .setColor(hex.white)
        .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
        .setAuthor(user.username, user.displayAvatarURL())
        .setTitle(`Central de atendimento ${client.user.username}`)
        .setDescription(`Eu acabei de enviar uma nova mensagem com as outras opções, role o chat para baixo e confira! ⏬`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username} (${page}/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)

      if(message.emoji.name === '⏩') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.white)
          .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(`Central de atendimento ${client.user.username}`)
          .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (${page+1}/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
          for(let i = 0; i < tiposComandos.length - (page * 11); i++) {
            const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i + (page * 11)]).map(comando => comando.name))]
            if(i < emojiArray.length) {
              helpEmbed.addField(`${emojiArray[i]} | ${tiposComandos[i + (page * 11)]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
            } else {
              helpEmbed.addField(`⏩ | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + (page * 11)]}`)
              i = Infinity
            }
          }
        helpEmbed.addField(`⏪ | Página anterior`, `Retorne para a página anterior`)
        await message.message.edit(oldEmbed)
        const newMsg = await message.message.channel.send(helpEmbed)
        for(let i = 0; i < tiposComandos.length - (page * 11); i++) {
          if(i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('⏩')
            i = Infinity
          }
        }
        newMsg.react('⏪')
        return;
      }
      
      if(message.emoji.name === '⏪') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.white)
          .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(`Central de atendimento ${client.user.username}`)
          .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (${page-1}/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
          for(let i = 0; i < tiposComandos.length - ((page - 2) * 11); i++) {
            const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i + ((page - 2) * 11)]).map(comando => comando.name))]
            if(i < emojiArray.length) {
              helpEmbed.addField(`${emojiArray[i]} | ${tiposComandos[i + ((page - 2) * 11)]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
            } else {
              helpEmbed.addField(`⏩ | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + ((page - 2) * 11)]}`)
              i = Infinity
            }
          }
        await message.message.edit(oldEmbed)
        const newMsg = await message.message.channel.send(helpEmbed)
        for(let i = 0; i < tiposComandos.length - ((page - 2) * 11); i++) {
          if(i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('⏩')
            i = Infinity
          }
        }
        if(page - 1 !== 1) {
          newMsg.react('⏪')
        }
        return;
      }
      const comandos = client.commands.filter(comando => comando.type === tiposComandos[emojiArray.indexOf(message.emoji.name) + (page * 11 - 11)])
      const nameComandos = [...new Set(comandos.map(comando => comando.name))]
      const descComandos = [...new Set(comandos.map(comando => comando.description))]
      const embed2 = new Discord.MessageEmbed()
        .setColor(hex.aqua)                
        .setAuthor(user.username, user.displayAvatarURL())
        .setTitle(`Comandos do tipo **${tiposComandos[emojiArray.indexOf(message.emoji.name) + (page * 11 - 11)]}**`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
      const embed = new Discord.MessageEmbed()
        .setColor(hex.aqua)                
        .setAuthor(user.username, user.displayAvatarURL())
        .setTitle(`Comandos do tipo **${tiposComandos[emojiArray.indexOf(message.emoji.name) + (page * 11 - 11)]}**`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
        for(let i = 0; i < nameComandos.length; i++) {
          if(i < 25) {
            embed.addField(config.prefix + nameComandos[i], descComandos[i])
          } else {
            embed2.addField(config.prefix + nameComandos[i], descComandos[i])
          }
        }
      await message.message.channel.send(embed)
      if(embed2.fields.length !== 0) {
        message.message.channel.send(embed2)
      }
    }
  }
}