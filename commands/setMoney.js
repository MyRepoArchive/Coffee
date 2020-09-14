const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "set",
  aliases: ["setaruser", "setuser", "setinuser", "setar"],
  type: "Dev commands",
  description: "Seta um valor específico de money para algum usuário",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    if(message.author.id !== config.owner) return run(message, client, `<:${emojis.slashred}>Você não pode usar este tipo de comando!`, emojis.slashred)
    if(podeAddReactions) await message.react(emojis.carregando)
    let mentioned = message.mentions.users.first() || client.users.cache.find(user => user.username.toLowerCase() === args.slice(2).join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.slice(2).join(' ').toLowerCase()) || client.users.cache.get(args[2]) || message.author
    if(args.length === 0) {
      run(message, client, `<:${emojis.xcirclered}>O comando deve ser usado assim: **${prefix}${comando} \`<coluna>\` \`<valor>\` \`<user>\`**`, emojis.xcirclered)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
      return;
    }
    const coluna = args[0].toLowerCase()
    const valor = args[1]
    if(!valor) {
      run(message, client, `<:${emojis.alertcircleamarelo}> Insira um valor válido!`, emojis.alertcircleamarelo)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
      return
    }
    if(mentioned.user !== undefined) mentioned = mentioned.user
    connection.query(`update users set ${coluna} = ? where iduser = ?`, [valor, mentioned.id], (err, result) => {
      if(err) {
        run(message, client, `<:${emojis.xcirclered}> Houve um erro ao setar os valores!`, emojis.xcirclered)
        throw err
      }
      run(message, client, `<:${emojis.circlecheckverde}> Foi setado em **${mentioned.username}** o valor de \`${valor}\` em \`${coluna}\``)
      if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
    })
  }
}