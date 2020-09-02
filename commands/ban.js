const config = require('../info.json')
const hex = require('../colors.json')
const Discord = require('discord.js')

module.exports = {
  name: "ban",
  name2: "banir",
  type: "Moderação",
  description: `Bane o(s) usuário(s) mencionado(s) do servidor!\nModo de usar:\nMencionando o(s) usuário(s): *${config.prefix}ban @user1 @user2 \`motivo do banimento\`\  \`5\`*\nPelo username ou apelido: *${config.prefix}ban username1 \\ apelido1 \`motivo do banimento\`  \`3\`*\n\nOBS: *Nem o motivo do banimento nem a quantidade de dias para deletar mensagens são obrigatórios, mas se for utilizá-los, coloque-os entre "\`" (crases) e após os usuários a serem banidos, na sequência (motivo, dias)!*\n*Para colocar a quantidade de dias para deletar mensagens você deve colocar um motivo (obrigatoriamente)!*`,

  async execute(message, args, comando, client, prefix) {
    const mencoes = message.mentions
    const usernamesDigitados = message.content.trim().slice(prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const banOptions = message.content.trim().slice((message.content.trim().split('').indexOf('`')+1 === 0) ? message.content.length : message.content.trim().split('').indexOf('`')+1).split('`')
    const motivo = banOptions.shift()
    banOptions.shift()
    const daysMsgDelete = banOptions.shift()
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      if (podeEnviarMsg) {
        message.channel.send(`<:slashred:747879954305253468> ${message.author}, você não pode banir membros nesse servidor!`);
      } else if (podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
    if (!botMembro.hasPermission("BAN_MEMBERS")) {
      if (podeEnviarMsg) {
        message.channel.send(`<:slashred:747879954305253468> ${message.author}, eu não tenho permissão para banir membros!`);
      } else if (podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
    function verificacoes(member) {
      let podeIr = false
      if (member.user.id === message.guild.ownerID) {
        if (podeEnviarMsg) {
          message.channel.send(`<:slashred:747879954305253468> ${message.author}, ele é o dono do servidor, não posso fazer isso!`)
        } else if (podeAddReactions) {
          message.react('slashred:747879954305253468')
        }
        return podeIr = false;
      }
      if (member.roles.highest.position >= botMembro.roles.highest.position) {
        if (podeEnviarMsg) {
          message.channel.send(`<:slashred:747879954305253468> ${message.author}, eu não posso banir esse membro, ele tem um cargo maior que o meu!`)
        } else if (podeAddReactions) {
          message.react('slashred:747879954305253468')
        }
        return podeIr = false;
      }
      if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) {
        if (podeEnviarMsg) {
          message.channel.send(`<:slashred:747879954305253468> ${message.author}, eu não posso banir esse membro, ele tem um cargo maior que o seu!`)
        } else if (podeAddReactions) {
          message.react('slashred:747879954305253468')
        }
        return podeIr = false;
      }
      if (member.user.id === client.user.id) {
        if (podeEnviarMsg) {
          message.channel.send(`<:alertcircleamarelo:747879938207514645> ${message.author}, eu não posso me banir do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
        } else if (podeAddReactions) {
          message.react('alertcircleamarelo:747879938207514645')
        }
        return podeIr = false;
      }
      if (member === message.member) {
        if (podeEnviarMsg) {
          message.channel.send(`<:alertcircleamarelo:747879938207514645> ${message.author}, você não pode se banir do servidor, isso é apenas questão de segurança!`);
        } else if (podeAddReactions) {
          message.react('alertcircleamarelo:747879938207514645')
        }
        return podeIr = false;
      }
      return podeIr = true
    }
    if (mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          const descEmbed = new Discord.MessageEmbed()
            .setColor(hex.blue2)
            .setTitle(`<:chute:748292333791084565> Como usar o ${prefix}${comando}`)
            .setDescription(`Modo de usar:\n**Mencionando o(s) usuário(s)** *${prefix}ban @user1 @user2 \`motivo do banimento\`\  \`5\`*\n**Pelo username ou apelido:** *${prefix}ban username1 \\ apelido1 \`motivo do banimento\`  \`3\`*\n\nOBS: *Nem o motivo do banimento nem a quantidade de dias para deletar mensagens são obrigatórios, mas se for utilizá-los, coloque-os entre "\`" (crases) e após os usuários a serem banidos, na sequência (motivo, dias)!*\n*Para colocar a quantidade de dias para deletar mensagens você deve colocar um motivo (obrigatoriamente)!*`)
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username}`, client.user.displayAvatarURL())
          message.reply(descEmbed)
        } else if (podeAddReactions) {
          message.react('helpcircleblue:747879943811235841')
        }
        return;
      } else {
        for(let i = 0; i < usernamesDigitados.length; i++) {
          const usernameMember = await message.guild.members.cache.find(member => member.user.username.toLowerCase() === usernamesDigitados[i])
          const nicknameMember = await message.guild.members.cache.find(member => (member.nickname === null || member.nickname === undefined) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
          if(usernameMember) {
            if(!verificacoes(usernameMember))return;
            usernameMember.ban({reason: motivo, days: (Number(daysMsgDelete) >= 0 && Number(daysMsgDelete) <= 7) ? Number(daysMsgDelete) : 7})
            if (podeManageMessages && i === usernamesDigitados.length - 1) {
              message.delete();
            } else if(podeEnviarMsg) { 
              message.channel.send(`<:circlecheckverde:747879943224033481> **${usernameMember.map(member => member.user.username)[0]}** foi banido com sucesso!`)
            } else if(podeAddReactions) {
              message.react('circlecheckverde:747879943224033481')
            }
          } else if(nicknameMember) {
            if(!verificacoes(nicknameMember))return;
            nicknameMember.ban({reason: motivo, days: (Number(daysMsgDelete) >= 0 && Number(daysMsgDelete) <= 7) ? Number(daysMsgDelete) : 7})
            if (podeManageMessages && i === usernamesDigitados.length - 1) {
              message.delete();
            } else if(podeEnviarMsg) {
              message.channel.send(`<:circlecheckverde:747879943224033481> **${nicknameMember.map(member => member.nickname)[0]}** foi banido com sucesso!`)
            } else if(podeAddReactions) {
              message.react('circlecheckverde:747879943224033481')
            }
          } else if(i === usernamesDigitados.length - 1) {
            if(podeEnviarMsg) {
              message.reply(`<:helpcircleblue:747879943811235841> eu não conheço esse membro!`)
            } else if(podeAddReactions) {
              message.react('helpcircleblue:747879943811235841')
            }
          }
        }
        return;
      }
    }
    for(let i = 0; i < mencoes.members.size; i++) {
      if(!verificacoes(mencoes.members.map(x => x)[i]))return;
      mencoes.members.map(x => x)[i].ban({reason: motivo, days: (Number(daysMsgDelete) >= 0 && Number(daysMsgDelete) <= 7) ? Number(daysMsgDelete) : 7})
      if (podeManageMessages && i === mencoes.members.size - 1) {
        message.delete();
      } else if(podeEnviarMsg) {
          message.reply(`<:circlecheckverde:747879943224033481> **${mencoes.members.map(x => x)[i].user.username}** foi expulso com sucesso!`)
      } else if(podeAddReactions) {
        message.react('circlecheckverde:747879943224033481')
      }
    }
  }
}