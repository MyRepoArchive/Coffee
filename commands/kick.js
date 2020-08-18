const config = require('../info.json')

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
    if (mencoes.members.size === 0) {
      if(usernamesDigitados[0] === '') {
        if (podeEnviarMsg) {
          message.reply(`Quem eu devo kickar do servidor?`);
        } else if (podeAddReactions) {
          message.react('❌')
        }
        return;
      } else {
        for(let i = 0; i < usernamesDigitados.length; i++) {
          const usernameMembers = await message.guild.members.cache.filter(member => member.user.username.toLowerCase() === usernamesDigitados[i])
          const nicknameMembers = await message.guild.members.cache.filter(member => (member.nickname === null) ? member.nickname : member.nickname.toLowerCase() === usernamesDigitados[i])
          if(usernameMembers.size !== 0) {
            if (!message.member.hasPermission("KICK_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`você não pode chutar membros nesse servidor!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (!botMembro.hasPermission("KICK_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`eu não tenho permissão para chutar membros!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.has(message.guild.ownerID)) {
              if (podeEnviarMsg) {
                message.reply(`ele é o dono do servidor, não posso fazer isso!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso chutar esse membro, ele tem um cargo maior que o meu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso chutar esse membro, ele tem um cargo maior que o seu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.has(botMembro)) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso me kickar do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (usernameMembers.has(message.member)) {
              if (podeEnviarMsg) {
                message.reply(`Você não pode se kickar do servidor, isso é apenas questão de segurança!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            usernameMembers.map(member => member.kick(motivo))
            if (podeManageMessages) {
              message.delete();
            } else if(podeEnviarMsg) {  
              message.reply(`**${usernameMembers.map(member => member.user.username)[0]}** foi expulso com sucesso!`)
            } else if(podeAddReactions) {
              message.react('✅')
            }
          } else if(nicknameMembers.size !== 0) {
            if (!message.member.hasPermission("KICK_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`você não pode chutar membros nesse servidor!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (!botMembro.hasPermission("KICK_MEMBERS")) {
              if (podeEnviarMsg) {
                message.reply(`eu não tenho permissão para chutar membros!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.has(message.guild.ownerID)) {
              if (podeEnviarMsg) {
                message.reply(`ele é o dono do servidor, não posso fazer isso!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso chutar esse membro, ele tem um cargo maior que o meu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso chutar esse membro, ele tem um cargo maior que o seu!`)
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.has(botMembro)) {
              if (podeEnviarMsg) {
                message.reply(`eu não posso me kickar do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            if (nicknameMembers.has(message.member)) {
              if (podeEnviarMsg) {
                message.reply(`Você não pode se kickar do servidor, isso é apenas questão de segurança!`);
              } else if (podeAddReactions) {
                message.react('❌')
              }
              return;
            }
            nicknameMembers.map(member => member.kick(motivo))
            if (podeManageMessages) {
              message.delete();
            } else if(podeEnviarMsg) {
              message.reply(`**${nicknameMembers.map(member => member.nickname)[0]}** foi expulso com sucesso!`)
            } else if(podeAddReactions) {
              message.react('✅')
            }
          } else {
            if(podeEnviarMsg) {
              message.reply(`eu não conheço esse membro!`)
            } else if(podeAddReactions) {
              message.react('❌')
            }
          }
          
        }
        return;
      }
    }
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      if (podeEnviarMsg) {
        message.reply(`você não pode chutar membros nesse servidor!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (!botMembro.hasPermission("KICK_MEMBERS")) {
      if (podeEnviarMsg) {
        message.reply(`eu não tenho permissão para chutar membros!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.members.has(message.guild.ownerID)) {
      if (podeEnviarMsg) {
        message.reply(`ele é o dono do servidor, não posso fazer isso!`)
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.members.map(user => user.roles.highest.position >= botMembro.roles.highest.position).indexOf(true) !== -1) {
      if (podeEnviarMsg) {
        message.reply(`eu não posso chutar esse membro, ele tem um cargo maior que o meu!`)
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.members.map(user => user.roles.highest.position >= message.member.roles.highest.position).indexOf(true) !== -1 && message.author.id !== message.guild.ownerID) {
      if (podeEnviarMsg) {
        message.reply(`eu não posso chutar esse membro, ele tem um cargo maior que o seu!`)
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.has(client.user)) {
      if (podeEnviarMsg) {
        message.reply(`eu não posso me kickar do servidor, faça isso manualmente ou peça ajuda a outro bot!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    if (mencoes.has(message.author)) {
      if (podeEnviarMsg) {
        message.reply(`Você não pode se kickar do servidor, isso é apenas questão de segurança!`);
      } else if (podeAddReactions) {
        message.react('❌')
      }
      return;
    }
    mencoes.members.map(user => user.kick(motivo))
    if (podeManageMessages) {
      message.delete();
    } else if(podeEnviarMsg) {
      if(mencoes.members.size > 1) {
        message.reply(`**${mencoes.members.map(member => member.user.username).join(', ')}** foram expulsos com sucesso!`)
      } else {
        message.reply(`**${mencoes.members.map(member => member.user.username)[0]}** foi expulso com sucesso!`)
      }
    } else if(podeAddReactions) {
      message.react('✅')
    }
  }
}