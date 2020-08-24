const Discord = require('discord.js');
const config = require('../info.json');
const hex = require('../colors.json');

module.exports = {
  name: 'number0:746000414020862003',
  name2: 'number1:746000414184570930',
  name3: 'number2:746000414259806229',
  name4: 'number3:746000414335303751',
  name5: 'number4:746000414276714526',
  name6: 'number5:746000414217994370',
  name7: 'number6:746000414310137956',
  name8: 'number7:746000413542580345',
  name9: 'number8:746000414201085962',
  name10: 'number9:746000414012473386',
  name11: 'number10:746000414985420810',
  name12: 'rewind:745274112691404850',
  name13: 'fastforward:745272739463561246',
  name14: 'anchor:745735266802597999',
  description: 'help',

  async execute(message, user, client) {
    const tiposComandos = [...new Set(client.commands.map(comando => comando.type))]
    const emojiArray = ['number0:746000414020862003', 'number1:746000414184570930', 'number2:746000414259806229', 'number3:746000414335303751', 'number4:746000414276714526', 'number5:746000414217994370', 'number6:746000414310137956', 'number7:746000413542580345', 'number8:746000414201085962', 'number9:746000414012473386', 'number10:746000414985420810']
    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title === `Central de atendimento ${client.user.username}`) {
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('(') + 1).split('').shift())

      if (message.emoji.identifier === 'fastforward:745272739463561246') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.white)
          .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(`Central de atendimento ${client.user.username}`)
          .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (${page + 1}/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
        for (let i = 0; i < tiposComandos.length - (page * 11); i++) {
          const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i + (page * 11)]).map(comando => comando.name))]
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${tiposComandos[i + (page * 11)]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
          } else {
            helpEmbed.addField(`<:fastforward:745272739463561246> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + (page * 11)]}`)
            i = Infinity
          }
        }
        helpEmbed.addField(`<:rewind:745274112691404850> | Página anterior`, `Retorne para a página anterior`)
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < tiposComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforward:745272739463561246')
            i = Infinity
          }
        }
        newMsg.react('rewind:745274112691404850')
        return;
      }

      if (message.emoji.identifier === 'rewind:745274112691404850') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.white)
          .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(`Central de atendimento ${client.user.username}`)
          .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (${page - 1}/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
        for (let i = 0; i < tiposComandos.length - ((page - 2) * 11); i++) {
          const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i + ((page - 2) * 11)]).map(comando => comando.name))]
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${tiposComandos[i + ((page - 2) * 11)]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
          } else {
            helpEmbed.addField(`<:fastforward:745272739463561246> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + ((page - 2) * 11)]}`)
            i = Infinity
          }
        }
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < tiposComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforward:745272739463561246')
            i = Infinity
          }
        }
        if (page - 1 !== 1) {
          newMsg.react('rewind:745274112691404850')
        }
        return;
      }
      const comandos = client.commands.filter(comando => comando.type === tiposComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)])
      const nameComandos = [...new Set(comandos.map(comando => comando.name))]
      const descComandos = [...new Set(comandos.map(comando => comando.description))]
      const embed = new Discord.MessageEmbed()
        .setColor(hex.aqua)
        .setAuthor(user.username, user.displayAvatarURL())
        .setTitle(`Comandos do tipo **${tiposComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)]}**`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username} [1/${(nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11)}]`, client.user.displayAvatarURL())
      for (let i = 0; i < nameComandos.length; i++) {
        if (i < emojiArray.length) {
          embed.addField(`<:${emojiArray[i]}> | ${config.prefix}${nameComandos[i]}`, `${descComandos[i].split(' ').slice(0, 10).join(' ')}[...]`)
        }
      }
      message.message.edit(embed)
      await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id))
      for (let i = 0; i < nameComandos.length; i++) {
        if (i < nameComandos.length) {
          message.message.react(emojiArray[i])
        } else {
          newMsg.react('fastforward:745272739463561246')
          i = Infinity
        }
      }
      message.message.react('anchor:745735266802597999')
    }

    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title.startsWith(`Comandos do tipo`)) {
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('[') + 1).split('').shift())
      const tipoComando = message.message.embeds[0].title.split('**')[1]
      const comandos = client.commands.filter(command => command.type === tipoComando)
      const nameComandos = [...new Set(comandos.map(comando => comando.name))]
      const descComandos = [...new Set(comandos.map(comando => comando.description))]
      if (message.emoji.identifier === 'fastforward:745272739463561246') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.aqua)
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(message.message.embeds[0].title)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} [${page + 1}/${(nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11)}]`)
        for (let i = 0; i < nameComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${config.prefix}${nameComandos[i + (page * 11)]}`, `${descComandos[i + (page * 11)].split(' ').slice(0, 10).join(' ')}[...]`)
          } else {
            helpEmbed.addField(`<:fastforward:745272739463561246> | Mais comandos`, `Exemplo: ${config.prefix}${nameComandos[i + (page * 11)]}`)
            i = Infinity
          }
        }
        helpEmbed.addField(`<:rewind:745274112691404850> | Página anterior`, `Retorne para a página anterior`)
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < nameComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforward:745272739463561246')
            i = Infinity
          }
        }
        newMsg.react('rewind:745274112691404850')
        return;
      }

      if (message.emoji.identifier === 'rewind:745274112691404850') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.aqua)
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(message.message.embeds[0].title)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (${page - 1}/${(nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11)})`)
        for (let i = 0; i < nameComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${config.prefix}${nameComandos[i + ((page - 2) * 11)]}`, `${descComandos[i + ((page - 2) * 11)].split(' ').slice(0, 10).join(' ')}[...]`)
          } else {
            helpEmbed.addField(`<:fastforward:745272739463561246> | Mais comandos`, `Exemplo: ${config.prefix}${nameComandos[i + ((page - 2) * 11)]}`)
            i = Infinity
          }
        }
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < nameComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforward:745272739463561246')
            i = Infinity
          }
        }
        if (page - 1 !== 1) {
          newMsg.react('rewind:745274112691404850')
        }
        return;
      }

      if (message.emoji.identifier === 'anchor:745735266802597999') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.white)
          .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(`Central de atendimento ${client.user.username}`)
          .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (1/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
        for (let i = 0; i < tiposComandos.length; i++) {
          const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i]).map(comando => comando.name))]
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${tiposComandos[i]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
          } else {
            helpEmbed.addField(`<:fastforward:745272739463561246> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
            i = Infinity
          }
        }

        await message.message.edit(helpEmbed)
        await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id))
        for(let i = 0; i < tiposComandos.length; i++) {
          if(i <= 10) {
              message.message.react(emojiArray[i])
          } else {
              message.message.react('fastforward:745272739463561246')
              i = Infinity
          }
        }
        return;
      }
      const name = client.commands.filter(comando => comando.name === nameComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)]).map(comando => comando.name)[0]
      const desc = client.commands.filter(comando => comando.description === descComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)]).map(comando => comando.description)[0]
      const embed = new Discord.MessageEmbed()
        .setColor(hex.blue2)
        .setTitle(`Comando **${config.prefix}${name}**`)
        .setAuthor(user.username, user.displayAvatarURL())
        .setDescription(desc)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`)
      await message.message.edit(embed)
      await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id))
      message.message.react('anchor:745735266802597999')
    }
    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title.startsWith(`Comando **`)) {
      if(message.emoji.identifier === 'anchor:745735266802597999') {
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.white)
          .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(`Central de atendimento ${client.user.username}`)
          .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} (1/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
        for (let i = 0; i < tiposComandos.length; i++) {
          const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i]).map(comando => comando.name))]
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${tiposComandos[i]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
          } else {
            helpEmbed.addField(`<:fastforward:745272739463561246> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
            i = Infinity
          }
        }

        await message.message.edit(helpEmbed)
        await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id))
        for(let i = 0; i < tiposComandos.length; i++) {
          if(i <= 10) {
              message.message.react(emojiArray[i])
          } else {
              message.message.react('fastforward:745272739463561246')
              i = Infinity
          }
        }
      }
    }
  }
}