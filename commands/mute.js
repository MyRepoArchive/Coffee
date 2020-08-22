const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "mute",
  name2: "mutar",
  name3: "silenciar",
  name4: "silencie",
  name5: "calar",
  name6: "cale",
  type: "Moderação",
  description: `Impossibilita o usuário citado de falar no servidor!\nModo de usar:\n**Mencionando o(s) usuário(s)** *${config.prefix}mute @user1 @user2*\n**Pelo username ou apelido:** *${config.prefix}mute username1 \\ apelido1*`,

  async execute(message, args, comando, client) {
    const mencoes = message.mentions
    const usernamesDigitados = message.content.trim().slice(config.prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    const motivo = message.content.trim().slice((message.content.trim().split('').indexOf('`')+1 === 0) ? message.content.length : message.content.trim().split('').indexOf('`')+1).split('`').shift()
    /* message.guild.roles.create({
      data: {
          name: "Muted",
          color: "#f5f5f5",
          hoist: false,
          mentionable: true,
          permissions: 1024,
      },
      reason: motivo,
    }).then(role => {
      mencoes.members.first().roles.set([role])
    }) */
    
    if(mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          const descEmbed = new Discord.MessageEmbed()
            .setColor(hex.blue2)
            .setTitle(`Como usar o ${config.prefix}${comando}`)
            .setDescription(`Modo de usar:\n**Mencionando o(s) usuário(s)** *${config.prefix}mute @user1 @user2*\n**Pelo username ou apelido:** *${config.prefix}mute username1 \\ apelido1*`)
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
          message.reply(descEmbed)
        } else if (podeAddReactions) {
          message.react('helpcircle:745759636589903922')
        }
        return;
      } else {
        for(let i = 0; i < usernamesDigitados.length; i++) {
          const usernameMembers = await message.guild.members.cache.filter(member => member.user.username.toLowerCase() === usernamesDigitados[i])
          const nicknameMembers = await message.guild.members.cache.filter(member => (member.nickname === null || member.nickname === undefined) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
          if(usernameMembers.size !== 0) {
            if (!message.member.hasPermission("MANAGE_ROLES")) {
              if (podeEnviarMsg) {
                message.reply(`você não pode mutar membros nesse servidor!`);
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (!botMembro.hasPermission("MANAGE_ROLES")) {
              if (podeEnviarMsg) {
                message.reply(`eu não tenho permissão para mutar membros!`);
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (usernameMembers.has(message.guild.ownerID)) {
              if (podeEnviarMsg) {
                message.reply(`ele é o dono do servidor, não posso fazer isso!`)
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (usernameMembers.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso mutar esse membro, ele tem um cargo maior que o meu!`)
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (usernameMembers.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso mutar esse membro, ele tem um cargo maior que o seu!`)
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (usernameMembers.has(botMembro)) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso me mutar no servidor, faça isso manualmente ou peça ajuda a outro bot!`);
              } else if (podeAddReactions) {
                message.react('alertcircle:745709428937981992')
              }
              return;
            }
            if (usernameMembers.has(message.member)) {
              if (podeEnviarMsg) {
                message.reply(`você não pode se mutar do servidor, isso é apenas questão de segurança!`);
              } else if (podeAddReactions) {
                message.react('alertcircle:745709428937981992')
              }
              return;
            }
            message.guild.roles.create({
              data: { name: "Muted", color: "#f5f5f5", hoist: false, mentionable: true, permissions: 1024 },
              reason: motivo
            }).then(role => {
              usernameMembers.map(member => member.roles.set([role]))
              if(podeManageMessages && i === usernamesDigitados.length - 1) {
                message.delete()
              } else if(podeEnviarMsg) {
                message.reply(`**${usernameMembers.map(member => member.user.username)[0]}** foi mutado com sucesso!`)
              } else if (podeAddReactions) {
                message.react('circlecheck:745763762132484197')
              }
            })
          } else if(nicknameMembers.size !== 0) {
            if (!message.member.hasPermission("MANAGE_ROLES")) {
              if (podeEnviarMsg) {
                message.reply(`você não pode mutar membros nesse servidor!`);
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (!botMembro.hasPermission("MANAGE_ROLES")) {
              if (podeEnviarMsg) {
                message.reply(`eu não tenho permissão para mutar membros!`);
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (nicknameMembers.has(message.guild.ownerID)) {
              if (podeEnviarMsg) {
                message.reply(`ele é o dono do servidor, não posso fazer isso!`)
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (nicknameMembers.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso mutar esse membro, ele tem um cargo maior que o meu!`)
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (nicknameMembers.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso mutar esse membro, ele tem um cargo maior que o seu!`)
              } else if (podeAddReactions) {
                message.react('slash:745761670340804660')
              }
              return;
            }
            if (nicknameMembers.has(botMembro)) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso me mutar no servidor, faça isso manualmente ou peça ajuda a outro bot!`);
              } else if (podeAddReactions) {
                message.react('alertcircle:745709428937981992')
              }
              return;
            }
            if (nicknameMembers.has(message.member)) {
              if (podeEnviarMsg) {
                message.reply(`Você não pode se mutar no servidor, isso é apenas questão de segurança!`);
              } else if (podeAddReactions) {
                message.react('alertcircle:745709428937981992')
              }
              return;
            }
            message.guild.roles.create({
              data: { name: "Muted", color: "#f5f5f5", hoist: false, mentionable: true, permissions: 1024 },
              reason: motivo
            }).then(role => {
              mencoes.members.first().roles.set([role])
              if(podeManageMessages && i === usernamesDigitados.length - 1) {
                message.delete()
              } else if(podeEnviarMsg) {
                message.reply(`**${usernameMembers.map(member => member.user.username)[0]}** foi mutado com sucesso!`)
              } else if (podeAddReactions) {
                message.react('circlecheck:745763762132484197')
              }
            })
          }
        }
      }
    }
  }
}