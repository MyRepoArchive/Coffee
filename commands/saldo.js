const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');

module.exports = {
  name: "saldo",
  name2: "money",
  name3: "dinheiro",
  name4: "ccoins",
  name5: "balanco",
  name6: "balanço",
  type: "Economia",
  description: "Veja quantos **<:ccoin:750776561753522276>CCoins** você tem disponível!",

  async execute(message, args, comando, client, prefix, connection) {
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    if (podeAddReactions) await message.react('a:carregando:750817054596137000') // Reagi na mensagem com um emoji de loading
    let mentioned = message.mentions.users.first() // Pega o primeiro usuario mencionado, caso haja algum!
    if (!mentioned) {
      mentioned = message.guild.members.cache.find(member => member.user.username === args.slice(0).join(' '))
      if (!mentioned) {
        mentioned = message.guild.members.cache.find(member => member.nickname === args.slice(0).join(' '))
        if (!mentioned) {
          mentioned = message.guild.members.cache.get(args[0])
        }
      }
    }
    if(mentioned !== undefined) {
      if (mentioned.user !== undefined) mentioned = mentioned.user // Se o mentioned retornar um membro, ele passa mentioned para user novamente
    }
    const money = await require('../utils/getMoney.js').getMoney(connection, message.author) // Puxa do banco de dados o money do author da mensagem
    if (money === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
    const bankMoney = await require('../utils/getMoney.js').getBankMoney(connection, message.author) // Puxa do banco de dados o bankmoney do author da mensagem
    if (bankMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
    const moneyEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor(hex.gold)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setTitle(`Este é o valor que você possui em mãos`)
      .setDescription(`**<:ccoin:750776561753522276>${money}**`)
      .addField(`Este é o valor que você possui no banco`, `**<:ccoinbank:750809655885693019>${bankMoney}**`)
      .setFooter(`Sistema de Economia ${client.user.username}`, client.user.displayAvatarURL())
    if (mentioned && message.author.id === config.owner && !mentioned.bot) {
      const mentionedMoney = await require('../utils/getMoney.js').getMoney(connection, mentioned) // Puxa do banco de dados o money do author da mensagem
      if (mentionedMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
      const bankMentionedMoney = await require('../utils/getMoney.js').getBankMoney(connection, mentioned) // Puxa do banco de dados o bankmoney do author da mensagem
      if (bankMentionedMoney === undefined) return this.execute(message, args, comando, client, prefix, connection) // Caso o valor do money do author seja indefinido, chama novamente a função execute()
      const moneyMentionedEmbed = new Discord.MessageEmbed()
        .setAuthor(mentioned.username, mentioned.displayAvatarURL())
        .setColor(hex.gold)
        .setThumbnail(mentioned.displayAvatarURL({ dynamic: true }))
        .setTitle(`Este é o valor que ${mentioned.username} possui em mãos`)
        .setDescription(`**<:ccoin:750776561753522276>${mentionedMoney}**`)
        .addField(`Este é o valor que ${mentioned.username} possui no banco`, `**<:ccoinbank:750809655885693019>${bankMentionedMoney}**`)
        .setFooter(`Sistema de Economia ${client.user.username}`, client.user.displayAvatarURL())
      if (podeEnviarMsg) {
        message.channel.send(moneyMentionedEmbed)
      } else {
        message.author.send(moneyMentionedEmbed).then(msg => {
          if (podeAddReactions) {
            message.react('send:745271212799950899')
          }
        }, () => {
          if (podeAddReactions) {
            message.react('alertcircleamarelo:747879938207514645')
          }
        })
      }
      message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
      return;
    }
    if (podeEnviarMsg) {
      message.channel.send(moneyEmbed)
    } else {
      message.author.send(moneyEmbed).then(msg => {
        if (podeAddReactions) {
          message.react('send:745271212799950899')
        }
      }, () => {
        if (podeAddReactions) {
          message.react('alertcircleamarelo:747879938207514645')
        }
      })
    }
    message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}