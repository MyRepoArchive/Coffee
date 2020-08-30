const config = require('../info.json')
const Discord = require('discord.js')
const hex = require('../colors.json')

module.exports = {
  name: "kick",
  name2: "chutar",
  name3: "chute",
  name4: "kickar",
  name5: "expulse",
  name6: "expulsar",
  type: "Moderação",
  description: `Expulsa o(s) usuário(s) mencionado(s) do servidor!\nModo de usar:\nMencionando o(s) usuário(s) *${config.prefix}kick @user1 @user2 \`\motivo da expulsão\`\*\nPelo username ou apelido:\n*${config.prefix}kick username1 \\ apelido1 \`\motivo da expulsão\`\*\n\nOBS: *O motivo da expulsão não é obrigatório, mas se for utilizá-lo, coloque-o entre "\`\" (crases) e após os usuários a serem expulsos!*`,

  async execute(message, args, comando, client) {
    const mencoes = message.mentions
    const usernamesDigitados = message.content.trim().slice(config.prefix.length + comando.length).split("\\").map(username => username.trim().toLowerCase())
    const motivo = message.content.trim().slice((message.content.trim().split('').indexOf('`')+1 === 0) ? message.content.length : message.content.trim().split('').indexOf('`')+1).split('`').shift()
    const botMembro = message.guild.member(client.user.id)
    const permissoesBot = message.channel.memberPermissions(botMembro)
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES")
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      if (podeEnviarMsg) {
        message.channel.send(`<:slashred:747879954305253468> ${message.author}, você não pode chutar membros nesse servidor!`);
      } else if (podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
    if (!botMembro.hasPermission("KICK_MEMBERS")) {
      if (podeEnviarMsg) {
        message.channel.send(`<:slashred:747879954305253468> ${message.author}, eu não tenho permissão para chutar membros!`);
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
          message.channel.send(`<:slashred:747879954305253468> ${message.author}, eu não posso chutar esse membro, ele tem um cargo maior que o meu!`)
        } else if (podeAddReactions) {
          message.react('slashred:747879954305253468')
        }
        return podeIr = false;
      }
      if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) {
        if (podeEnviarMsg) {
          message.channel.send(`<:slashred:747879954305253468> ${message.author}, eu não posso chutar esse membro, ele tem um cargo maior que o seu!`)
        } else if (podeAddReactions) {
          message.react('slashred:747879954305253468')
        }
        return podeIr = false;
      }
      if (member.user.id === client.user.id) {
        if (podeEnviarMsg) {
          message.channel.send(`<:alertcircleamarelo:747879938207514645> ${message.author}, eu não posso me kickar do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
        } else if (podeAddReactions) {
          message.react('alertcircleamarelo:747879938207514645')
        }
        return podeIr = false;
      }
      if (member === message.member) {
        if (podeEnviarMsg) {
          message.channel.send(`<:alertcircleamarelo:747879938207514645> ${message.author}, você não pode se kickar do servidor, isso é apenas questão de segurança!`);
        } else if (podeAddReactions) {
          message.react('alertcircleamarelo:747879938207514645')
        }
        return podeIr = false;
      }
      return podeIr = true;
    }
    if (mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          const descEmbed = new Discord.MessageEmbed()
            .setColor(hex.blue2)
            .setTitle(`<:chute:748292333791084565> Como usar o ${config.prefix}${comando}`)
            .setDescription(`Modo de usar:\n**Mencionando o(s) usuário(s):** *${config.prefix}kick @user1 @user2 \`\motivo da expulsão\`\*\n**Pelo username ou apelido:** *${config.prefix}kick username1 \\ apelido1 \`\motivo da expulsão\`\*\n\nOBS: *O motivo da expulsão não é obrigatório, mas se for utilizá-lo, coloque-o entre "\`\" (crases) e após os usuários a serem expulsos!*`)
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
            usernameMember.kick(motivo)
            if (podeManageMessages && i === usernamesDigitados.length - 1) {
              message.delete();
            } else if(podeEnviarMsg) {  
              message.channel.send(`**${usernameMember.user.username}** foi expulso com sucesso! <:circlecheckverde:747879943224033481>`)
            } else if(podeAddReactions) {
              message.react('circlecheckverde:747879943224033481')
            }
          } else if(nicknameMember) {
            if(!verificacoes(nicknameMember))return;
            nicknameMember.kick(motivo)
            if (podeManageMessages && i === usernamesDigitados.length - 1) {
              message.delete();
            } else if(podeEnviarMsg) {
              message.channel.send(`**${nicknameMember.nickname}** foi expulso com sucesso! <:circlecheckverde:747879943224033481>`)
            } else if(podeAddReactions) {
              message.react('circlecheckverde:747879943224033481')
            }
          } else if(i === usernamesDigitados.length - 1) {
            if(podeEnviarMsg) {
              message.channel.send(`<:helpcircleblue:747879943811235841> ${message.author}, eu não conheço esse membro!`)
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
      mencoes.members.map(x => x)[i].kick(motivo)
      if (podeManageMessages && i === mencoes.members.size - 1) {
        message.delete();
      } else if(podeEnviarMsg) {
          message.channel.send(`**${mencoes.members.map(x => x)[i].user.username}** foi expulso com sucesso! <:circlecheckverde:747879943224033481>`)
      } else if(podeAddReactions) {
        message.react('circlecheckverde:747879943224033481')
      }
    }
  }
}