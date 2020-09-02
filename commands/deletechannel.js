const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "deletechannel",
  name2: "deletarcanal",
  name3: "deletecanal",
  name4: "excluircanal",
  name5: "excluacanal",
  name6: "excluirchannel",
  name7: "apagarcanal",
  name8: "apaguecanal",
  name9: "deletechannels",
  name10: "deletarcanais",
  name11: "deletecanais",
  name12: "excluircanais",
  name13: "excluacanais",
  name14: "excluirchannels",
  name15: "apagarcanais",
  name16: "apaguecanais",
  type: "Gerenciamento",
  description: `Você pode utilizar esse comando para deletar um canal de algum servidor que você tenha a devida permissão.\nModo de usar:\nMencionando o canal: *${config.prefix}deletechannel #nome-do-canal-1 #nome-do-canal-2*\nDitando o ID do canal: *${config.prefix}deletechannel id_do_canal_1 id_do_canal_2*`,

  async execute(message, args, comando, client, prefix) {
    const mencoes = message.mentions.channels
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    if(mencoes.size === 0) {
      if(args.length === 0) {
        if (podeEnviarMsg) {
          const descEmbed = new Discord.MessageEmbed()
            .setColor(hex.blue2)
            .setTitle(`<:textchannelblockedclaro:748224336690806856> Como usar o ${prefix}${comando}`)
            .setDescription(`Modo de usar:\nMencionando o canal: *${prefix}deletechannel #nome-do-canal-1 #nome-do-canal-2*\nDitando o ID do canal: *${prefix}deletechannel id_do_canal_1 id_do_canal_2*`)
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
          message.reply(descEmbed)
        } else if (podeAddReactions) {
          message.react('helpcircleblue:747879943811235841')
        }
        return;
      } else {
        for(let i = 0; i < args.length; i++) {
          const channel = message.guild.channels.cache.get(args[i])
          if(channel) {
            if(channel.memberPermissions(botMembro).has("MANAGE_CHANNELS")) { // Verifica se o bot pode gerenciar aquele canal citado pelo membro
              if(channel.memberPermissions(message.member).has("MANAGE_CHANNELS")) {
                await channel.delete()
                if(podeEnviarMsg) {
                  message.channel.send(`<:circlecheckverde:747879943224033481> Pronto **${message.author.username}**, o canal **${channel.name}** foi deletado com sucesso!`)
                } else if(podeAddReactions) {
                  message.react('circlecheckverde:747879943224033481')
                }
              } else {
                if(podeEnviarMsg) {
                  message.channel.send(`<:xcirclered:747879954708037662> ${message.author}, você não pode deletar esse canal!`)
                } else if(podeAddReactions) {
                  message.react('xcirclered:747879954708037662')
                }
              }
            } else {
              if(podeEnviarMsg) {
                message.channel.send(`<:xcirclered:747879954708037662> ${message.author}, eu não consigo deletar esse canal!`)
              } else if(podeAddReactions) {
                message.react('xcirclered:747879954708037662')
              }
            }
          } else {
            if(podeEnviarMsg) {
              message.channel.send(`<:helpcircleblue:747879943811235841> ${message.author}, eu não conheço este canal!`)
            } else if(podeAddReactions) {
              message.react('helpcircleblue:747879943811235841')
            }
          }
        }
        return;
      }
    }
    for(let i = 0; i < mencoes.size; i++) {
      const canal = mencoes.map(x => x)[i]
      if(canal.memberPermissions(botMembro).has("MANAGE_CHANNELS")) {
        if(canal.memberPermissions(message.member).has("MANAGE_CHANNELS")) {
          await canal.delete()
          if(podeEnviarMsg) {
            message.channel.send(`<:circlecheckverde:747879943224033481> Pronto **${message.author.username}**, o canal **${canal.name}** foi deletado com sucesso!`)
          } else if(podeAddReactions) {
            message.react('circlecheckverde:747879943224033481')
          }
        }
      } else {
        if(podeEnviarMsg) {
          message.channel.send(`<:xcirclered:747879954708037662> ${message.author}, eu não consigo deletar esse canal!`)
        } else if(podeAddReactions) {
          message.react('xcirclered:747879954708037662')
        }
      }
    }
  }
}