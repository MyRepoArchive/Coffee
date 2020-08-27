const Discord = require('discord.js');
const config = require('../info.json');
const hex = require('../colors.json');

module.exports = {
  name: 'number0blue:747879954875809952',
  name2: 'number1blue:747879954464637039',
  name3: 'number2blue:747879955773390859',
  name4: 'number3blue:747879956130037770',
  name5: 'number4blue:747879955907477544',
  name6: 'number5blue:747879955773259907',
  name7: 'number6blue:747879956100677665',
  name8: 'number7blue:747879955618332845',
  name9: 'number8blue:747879956054540439',
  name10: 'number9blue:747879956012466336',
  name11: 'number10blue:7478799559873006020602',
  name12: 'rewindblue:747879941143527554',
  name13: 'fastforwardblue:747879944192917635',
  name14: 'homecircle:748316988471771157',
  description: 'help',

  async execute(message, user, client) {
    const tiposComandos = [...new Set(client.commands.map(comando => comando.type))]
    const emojiArray = ['number0blue:747879954875809952', 'number1blue:747879954464637039', 'number2blue:747879955773390859', 'number3blue:747879956130037770', 'number4blue:747879955907477544', 'number5blue:747879955773259907', 'number6blue:747879956100677665', 'number7blue:747879955618332845', 'number8blue:747879956054540439', 'number9blue:747879956012466336', 'number10blue:7478799559873006020602']
    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title === `Central de atendimento ${client.user.username}`) {
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('(') + 1).split('').shift())

      if (message.emoji.identifier === 'fastforwardblue:747879944192917635') {
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
            helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + (page * 11)]}`)
            i = Infinity
          }
        }
        helpEmbed.addField(`<:rewindblue:747879941143527554> | Página anterior`, `Retorne para a página anterior`)
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < tiposComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforwardblue:747879944192917635')
            i = Infinity
          }
        }
        newMsg.react('rewindblue:747879941143527554')
        return;
      }

      if (message.emoji.identifier === 'rewindblue:747879941143527554') {
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
            helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + ((page - 2) * 11)]}`)
            i = Infinity
          }
        }
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < tiposComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforwardblue:747879944192917635')
            i = Infinity
          }
        }
        if (page - 1 !== 1) {
          newMsg.react('rewindblue:747879941143527554')
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
          newMsg.react('fastforwardblue:747879944192917635')
          i = Infinity
        }
      }
      message.message.react('homecircle:748316988471771157')
    }

    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title.startsWith(`Comandos do tipo`)) {
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('[') + 1).split('').shift())
      const tipoComando = message.message.embeds[0].title.split('**')[1]
      const comandos = client.commands.filter(command => command.type === tipoComando)
      const nameComandos = [...new Set(comandos.map(comando => comando.name))]
      const descComandos = [...new Set(comandos.map(comando => comando.description))]
      if (message.emoji.identifier === 'fastforwardblue:747879944192917635') {
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
            helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais comandos`, `Exemplo: ${config.prefix}${nameComandos[i + (page * 11)]}`)
            i = Infinity
          }
        }
        helpEmbed.addField(`<:rewindblue:747879941143527554> | Página anterior`, `Retorne para a página anterior`)
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < nameComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforwardblue:747879944192917635')
            i = Infinity
          }
        }
        newMsg.react('rewindblue:747879941143527554')
        return;
      }

      if (message.emoji.identifier === 'rewindblue:747879941143527554') {
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
            helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais comandos`, `Exemplo: ${config.prefix}${nameComandos[i + ((page - 2) * 11)]}`)
            i = Infinity
          }
        }
        const newMsg = await message.message.edit(helpEmbed)
        await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id))
        for (let i = 0; i < nameComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react('fastforwardblue:747879944192917635')
            i = Infinity
          }
        }
        if (page - 1 !== 1) {
          newMsg.react('rewindblue:747879941143527554')
        }
        return;
      }

      if (message.emoji.identifier === 'homecircle:748316988471771157') {
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
            helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
            i = Infinity
          }
        }

        await message.message.edit(helpEmbed)
        await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id))
        for(let i = 0; i < tiposComandos.length; i++) {
          if(i <= 10) {
              message.message.react(emojiArray[i])
          } else {
              message.message.react('fastforwardblue:747879944192917635')
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
      message.message.react('homecircle:748316988471771157')
    }
    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title.startsWith(`Comando **`)) {
      if(message.emoji.identifier === 'homecircle:748316988471771157') {
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
            helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
            i = Infinity
          }
        }

        await message.message.edit(helpEmbed)
        await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id))
        for(let i = 0; i < tiposComandos.length; i++) {
          if(i <= 10) {
              message.message.react(emojiArray[i])
          } else {
              message.message.react('fastforwardblue:747879944192917635')
              i = Infinity
          }
        }
      }
    }
  }
}