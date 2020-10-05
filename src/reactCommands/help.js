const Discord = require('discord.js');
const config = require('../info.json');
const hex = require('../colors.json');
const emojis = require('../emojis.json');

module.exports = {
  name: emojis.number0blue,
  aliases: [emojis.number1blue, emojis.number2blue, emojis.number3blue, emojis.number4blue, emojis.number5blue, emojis.number6blue, emojis.number7blue, emojis.number8blue, emojis.number9blue, emojis.number10blue, emojis.rewindblue, emojis.fastforwardblue, emojis.homecircle],
  description: 'help',

  async execute(message, user, client) {
    const tiposComandos = [...new Set(client.commands.filter(comando => comando.type !== "Dev commands").map(comando => comando.type))]
    const emojiArray = [emojis.number0blue, emojis.number1blue, emojis.number2blue, emojis.number3blue, emojis.number4blue, emojis.number5blue, emojis.number6blue, emojis.number7blue, emojis.number8blue, emojis.number9blue, emojis.number10blue]
    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title === `Central de atendimento ${client.user.username}`) {
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('(') + 1).split('').shift())

      if (message.emoji.identifier === emojis.fastforwardblue) {
        if(page+1 > (tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)) return;
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
            helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + (page * 11)]}`)
            i = Infinity
          }
        }
        helpEmbed.addField(`<:${emojis.rewindblue}> | Página anterior`, `Retorne para a página anterior`)
        const newMsg = await message.message.edit(helpEmbed)
        /* await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id)) */
        const reaction = newMsg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
        if(reaction) reaction.users.remove(client.user.id)
        for (let i = 0; i < tiposComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react(emojis.fastforwardblue)
            i = Infinity
          }
        }
        newMsg.react(emojis.rewindblue)
        return;
      }

      if (message.emoji.identifier === emojis.rewindblue) {
        if(page-1 < 1) return;
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
            helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i + ((page - 2) * 11)]}`)
            i = Infinity
          }
        }
        const newMsg = await message.message.edit(helpEmbed)
        /* await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id)) */
        const reaction = newMsg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
        if(reaction) reaction.users.remove(client.user.id)
        for (let i = 0; i < tiposComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react(emojis.fastforwardblue)
            i = Infinity
          }
        }
        if (page - 1 === 1) {
          newMsg.reactions.cache.find(react => react.emoji.identifier === emojis.rewindblue).users.remove(client.user.id)
        }
        return;
      }
      if(tiposComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)] === undefined)return;
      const comandos = client.commands.filter(comando => comando.type === tiposComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)])
      const nameComandos = [...new Set(comandos.map(comando => comando.name))]
      const descComandos = [...new Set(comandos.map(comando => comando.description))]
      const embed = new Discord.MessageEmbed()
        .setColor(hex.lightstategray)
        .setAuthor(user.username, user.displayAvatarURL())
        .setTitle(`Comandos do tipo **${tiposComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)]}**`)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username} [1/${(nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11)}]`, client.user.displayAvatarURL())
      for (let i = 0; i < nameComandos.length; i++) {
        if (i < emojiArray.length) {
          embed.addField(`<:${emojiArray[i]}> | ${config.prefix}${nameComandos[i]}`, `${descComandos[i].split(' ').slice(0, 10).join(' ')}[...]`)
        } else {
          embed.addField(`<:${emojis.fastforwardblue}> | Mais comandos`, `EX: ${config.prefix}${nameComandos[i]}`)
        }
      }
      message.message.edit(embed)
      /* await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id)) */
      const reaction = message.message.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
      if(reaction) reaction.users.remove(client.user.id)
      for (let i = 0; i < nameComandos.length; i++) {
        if (i < emojiArray.length) {
          message.message.react(emojiArray[i])
        } else {
          message.message.react(emojis.fastforwardblue)
          i = Infinity
        }
      }
      message.message.react(emojis.homecircle)
    }

    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title.startsWith(`Comandos do tipo`)) {
      const page = parseInt(message.message.embeds[0].footer.text.slice(message.message.embeds[0].footer.text.split('').lastIndexOf('[') + 1).split('').shift())
      const tipoComando = message.message.embeds[0].title.split('**')[1]
      const comandos = client.commands.filter(command => command.type === tipoComando)
      const nameComandos = [...new Set(comandos.map(comando => comando.name))]
      const descComandos = [...new Set(comandos.map(comando => comando.description))]

      if (message.emoji.identifier === emojis.fastforwardblue) {
        if(page+1 > ((nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11))) return;
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.lightstategray)
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(message.message.embeds[0].title)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} [${page + 1}/${(nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11)}]`)
        for (let i = 0; i < nameComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${config.prefix}${nameComandos[i + (page * 11)]}`, `${descComandos[i + (page * 11)].split(' ').slice(0, 10).join(' ')}[...]`)
          } else {
            helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais comandos`, `Exemplo: ${config.prefix}${nameComandos[i + (page * 11)]}`)
            i = Infinity
          }
        }
        helpEmbed.addField(`<:${emojis.rewindblue}> | Página anterior`, `Retorne para a página anterior`)
        const newMsg = await message.message.edit(helpEmbed)
        /* await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id)) */
        const reaction = newMsg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
        if(reaction) reaction.users.remove(client.user.id)
        for (let i = 0; i < nameComandos.length - (page * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react(emojis.fastforwardblue)
            i = Infinity
          }
        }
        newMsg.react(emojis.rewindblue)
        return;
      }

      if (message.emoji.identifier === emojis.rewindblue) {
        if(page-1 < 1) return;
        const helpEmbed = new Discord.MessageEmbed()
          .setColor(hex.lightstategray)
          .setAuthor(user.username, user.displayAvatarURL())
          .setTitle(message.message.embeds[0].title)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username} [${page - 1}/${(nameComandos.length % 11 > 0) ? parseInt(nameComandos.length / 11) + 1 : parseInt(nameComandos.length / 11)}]`)
        for (let i = 0; i < nameComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            helpEmbed.addField(`<:${emojiArray[i]}> | ${config.prefix}${nameComandos[i + ((page - 2) * 11)]}`, `${descComandos[i + ((page - 2) * 11)].split(' ').slice(0, 10).join(' ')}[...]`)
          } else {
            helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais comandos`, `Exemplo: ${config.prefix}${nameComandos[i + ((page - 2) * 11)]}`)
            i = Infinity
          }
        }
        const newMsg = await message.message.edit(helpEmbed)
        /* await newMsg.reactions.map(reaction => reaction.users.remove(client.user.id)) */
        const reaction = newMsg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
        if(reaction) reaction.users.remove(client.user.id)
        for (let i = 0; i < nameComandos.length - ((page - 2) * 11); i++) {
          if (i < emojiArray.length) {
            newMsg.react(emojiArray[i])
          } else {
            newMsg.react(emojis.fastforwardblue)
            i = Infinity
          }
        }
        if (page - 1 === 1) {
          newMsg.reactions.cache.find(react => react.emoji.identifier === emojis.rewindblue).users.remove(client.user.id)
        }
        return;
      }

      if (message.emoji.identifier === emojis.homecircle) {
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
            helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
            i = Infinity
          }
        }

        await message.message.edit(helpEmbed)
        /* await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id)) */
        const reaction = message.message.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
        if(reaction) reaction.users.remove(client.user.id)
        for(let i = 0; i < tiposComandos.length; i++) {
          if(i <= 10) {
              message.message.react(emojiArray[i])
          } else {
              message.message.react(emojis.fastforwardblue)
              i = Infinity
          }
        }
        return;
      }
      const name = client.commands.filter(comando => comando.name === nameComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)]).map(comando => comando.name)[0]
      if(!name)return;
      const desc = client.commands.filter(comando => comando.description === descComandos[emojiArray.indexOf(message.emoji.identifier) + (page * 11 - 11)]).map(comando => comando.description)[0]
      const embed = new Discord.MessageEmbed()
        .setColor(hex.blue2)
        .setTitle(`Comando **${config.prefix}${name}**`)
        .setAuthor(user.username, user.displayAvatarURL())
        .setDescription(desc)
        .setTimestamp()
        .setFooter(`Sistema de ajuda ${client.user.username}`)
      await message.message.edit(embed)
      /* await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id)) */
      message.message.react(emojis.homecircle)
    }
    if (message.me && message.message.embeds[0] !== undefined && message.message.embeds[0].title.startsWith(`Comando **`)) {
      if(message.emoji.identifier === emojis.homecircle) {
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
            helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
            i = Infinity
          }
        }

        await message.message.edit(helpEmbed)
        /* await message.message.reactions.cache.map(reaction => reaction.users.remove(client.user.id)) */
        const reaction = message.message.reactions.cache.find(react => react.emoji.identifier === emojis.fastforwardblue)
        if(reaction) reaction.users.remove(client.user.id)
        for(let i = 0; i < tiposComandos.length; i++) {
          if(i <= 10) {
              message.message.react(emojiArray[i])
          } else {
              message.message.react(emojis.fastforwardblue)
              i = Infinity
          }
        }
      }
    }
  }
}