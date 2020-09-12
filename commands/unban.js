const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "unban",
  name2: "desban",
  name3: "desbanir",
  type: "Moderação",
  description: `Você pode desbanir aquele usuário que foi anteriormente banido com esse comando.\nModo de usar: *${config.prefix}unban \`username\`*\nou: *${config.prefix}unban \`userID\`*`,

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js');
    const botMembro = message.guild.member(client.user.id)
    if(!message.member.hasPermission("BAN_MEMBERS")) return run(message, client, `<:${emojis.slashred}> Você não pode desbanir membros neste servidor!`, emojis.slashred)
    if(!botMembro.hasPermission("BAN_MEMBERS"))return run(message, client, `<:${emojis.slashred}> Eu não tenho permissão para desbanir membros neste servidor!`, emojis.slashred)
    if(args.length === 0) return run(message, client, `<:${emojis.helpcircleblue}> Modo de usar: *${config.prefix}unban \`username\`*\nou: *${config.prefix}unban \`userID\`*`, emojis.helpcircleblue)
    let mentioned = message.mentions.users.first() || client.users.cache.find(user => user.username.toLowerCase() === args.join(' ').toLowerCase())
    if(!mentioned) {
      mentioned = await client.users.fetch(args[0]).catch(err => {
        run(message, client, `<:${emojis.alertcircleamarelo}> Por favor mencione, digite o username ou coloque o ID válido do usuário a ser desbanido!`, emojis.alertcircleamarelo)
      })
      if(!mentioned)return;
    }
    message.guild.fetchBan(mentioned).then(() => {
      message.guild.members.unban(mentioned).then(user => {
        run(message, client, `<:${emojis.circlecheckverde}> O usuário ${user.username} foi desbanido com sucesso!`, emojis.circlecheckverde)
      }, () => {
        run(message, client, `<:${emojis.xcirclered}> Não foi possível desbanir o usuário!`, emojis.circlecheckverde)
      })
    }, () => {
      run(message, client, `<:${emojis.alertcircleamarelo}> O usuário citado não está banido!`, emojis.alertcircleamarelo)
    })
  }
}