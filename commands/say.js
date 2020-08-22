const config = require('../info.json');
const Discord = require('discord.js');
const hex = require('../colors.json')

module.exports = {
  name: "say",
  name2: "falar",
  name3: "diga",
  name4: "fale",
  name5: "repita",
  name6: "repeat",
  type: "Geral",
  description: `"Faça das suas as minhas palavras"\nComo usar:\n**No mesmo canal:** *${config.prefix}say O que deve ser dito por mim*\n**Em outro canal do servidor:** *${config.prefix}say #outro-canal O que deve ser dito por mim*\n**Usando Embed no mesmo canal:** *${config.prefix}say \`\embed\`\ Título da embed \\ Descrição da embed \\ #f5f5f5*\n**Usando Embed em outro canal:** *${config.prefix}say #outro-canal \`\embed\`\ Título da embed \\ Descrição da embed \\ #808080*\n\n*OBS: Se você for utilizar embed na sua mensagem, coloque o termo **"embed"** entre crases. O título da embed é obrigatório, mas a descrição e a cor não são. Se você ficou confuso do que deve ser colocado no ultimo campo da embed, aquilo deve ser a cor em **hex** que a embed deve assumir. Como você também deve ter percebido, os campos da embed devem ser separados com "**\\**" (barra invertida)!*`,

  async execute(message, args, comando, client) {
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    const canaisServer = message.guild.channels.cache
    const canaisServerId = canaisServer.map(canal => canal.id)
    // Se não houver argumentos na frente do comando, verifica se pode enviar mensagens naquele canal, caso não possa, verifica se pode adicionar reações, caso não possa apenas retorna.
    if (args.length === 0) {
      if (podeEnviarMsg) {
        const descEmbed = new Discord.MessageEmbed()
          .setColor(hex.blue2)
          .setTitle(`Como usar o comando ${config.prefix}${comando}`)
          .setDescription(`Como usar:\n**No mesmo canal:** *${config.prefix}say O que deve ser dito por mim*\n**Em outro canal do servidor:** *${config.prefix}say #outro-canal O que deve ser dito por mim*\n**Usando Embed no mesmo canal:** *${config.prefix}say \`\embed\`\ Título da embed \\ Descrição da embed \\ #f5f5f5*\n**Usando Embed em outro canal:** *${config.prefix}say #outro-canal \`\embed\`\ Título da embed \\ Descrição da embed \\ #808080*\n\n*OBS: Se você for utilizar embed na sua mensagem, coloque o termo **"embed"** entre crases. O título da embed é obrigatório, mas a descrição e a cor não são. Se você ficou confuso do que deve ser colocado no ultimo campo da embed, aquilo deve ser a cor em **hex** que a embed deve assumir. Como você também deve ter percebido, os campos da embed devem ser separador com "**\\**" (barra invertida)!*`)
          .setTimestamp()
          .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
        message.reply(descEmbed)
      } else if (podeAddReactions) {
        message.react('helpcircle:745759636589903922')
      }
      return;
    }
    // Verifica se contém @everyone ou @here na mensagem, caso tenha, verifica se o author pode mencionar everyone, caso possa apenas procede, caso não possa, verifica se pode enviar mensagem, caso não possa, verifica se pode adicionar reações, caso não possa apenas retorna. OBS: Caso o bot possa enviar mensagens ele vai verificar se pode deletar mensagens.
    if (args.indexOf("@everyone") !== -1 || args.indexOf("@here") !== -1) {
      if (!message.member.hasPermission("MENTION_EVERYONE")) {
        if (podeEnviarMsg) {
          message.reply(`Você não pode marcar everyone/here meu querido!`)
        } else if (podeAddReactions) {
          message.react('slash:745761670340804660')
        }
        if (podeManageMessages) {
          message.delete()
        }
        return;
      }
    }
    // Faz uma varredura em todos os canais do servidor, em cada passagem vai verificar se existe naquele servidor o canal mencionado, se existir, vai verificar se naquele canal o bot pode enviar mensagens, caso possa, ele vai verificar se o usuário também pode, se poder, ele vai enviar a mensagem do usuário e vai verificar se pode deletar mensagens no canal onde foi dado o comando. Caso no canal mencionado não possa enviar mensagens, o bot vai verificar se pode adicionar reações, caso a resposta seja negativa, apenas procede o código, caso seja positiva, ele adiciona reação e procede o código.
    for (let i = 0; i < canaisServerId.length; i++) {
      if (args[0] === `<#${canaisServerId[i]}>`) {
        if (canaisServer.get(canaisServerId[i]).memberPermissions(botMembro).has("SEND_MESSAGES")) {
          if (canaisServer.get(canaisServerId[i]).memberPermissions(message.member).has("SEND_MESSAGES")) {
            if(args[1] !== "`embed`") {
              if(args[1] !== undefined) {
                canaisServer.get(canaisServerId[i]).send(message.content.slice(config.prefix.length + comando.length + 5 + canaisServerId[i].length))
              } else {
                if(podeEnviarMsg) {
                  message.reply(`O que eu devo falar?`)
                } else if(podeAddReactions) {
                  message.react('helpcircle:745759636589903922')
                }
                return;
              }
            } else {
              const embedFields = message.content.trim().slice(config.prefix.length + comando.length + 12 + canaisServerId[i].length).split("\\").map(f => f.trim())
              const title = embedFields[0]
              const description = embedFields[1]
              const color = embedFields[2]
              if (title !== '') {
                const embed = new Discord.MessageEmbed()
                  .setTitle(title)
                  .setDescription((description === undefined) ? '\u200B' : description)
                  if(color !== undefined) {
                    embed.setColor((color.length === 6 || color.length === 7) ? color : hex.blue2)
                  } else {
                    embed.setColor(hex.blue2)
                  }
                canaisServer.get(canaisServerId[i]).send(embed)
              } else {
                canaisServer.get(canaisServerId[i]).send(message.content.slice(config.prefix.length + comando.length + 5 + canaisServerId[i].length))
              }
            }
            if (podeManageMessages) {
              message.delete()
            }
            return;
          } else if (podeAddReactions) {
            message.react('slash:745761670340804660')
          }
        } else if (podeAddReactions) {
          message.react('slash:745761670340804660')
        }
      }
    }
    // Verifica se o usuário quer sua mensagem em uma embed
    if (args[0] === "`embed`") {
      const embedFields = message.content.trim().slice(config.prefix.length + comando.length + 9).split("\\").map(f => f.trim())
      const title = embedFields[0]
      const description = embedFields[1]
      const color = embedFields[2]
      if (title !== '') {
        const embed = new Discord.MessageEmbed()
          .setTitle(title)
          .setDescription((description === undefined) ? '\u200B' : description)
          if(color !== undefined) {
            embed.setColor((color.length === 6 || color.length === 7) ? color : hex.blue2)
          } else {
            embed.setColor(hex.blue2)
          }
        if (podeEnviarMsg) {
          message.channel.send(embed)
        } else if (podeAddReactions) {
          message.react('slash:745761670340804660')
          return;
        }
        // Verifica se naquele canal o bot pode deletar mensagens
        if (podeManageMessages) {
          message.delete()
        }
        return;
      }
    }
    // Verifica se o bot pode enviar mensagem naquele canal, se não poder, verificar se pode adicionar reações, em seguida retorna.
    if (podeEnviarMsg) {
      message.channel.send(message.content.slice(config.prefix.length + comando.length + 1))
    } else if (podeAddReactions) {
      message.react('slash:745761670340804660')
      return;
    }
    // Verifica se naquele canal o bot pode deletar mensagens
    if (podeManageMessages) {
      message.delete()
    }
  }
}