// Requerimentos padrões
const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')
const emojis = require('../emojis.json');

module.exports = { // O que vai ser exportado
  name: "avatar",
  aliases: ["mostraravatar", "fotodeperfil", "imagemdeperfil", "imagedeperfil", "displayavatar"],
  type: "Informativo",
  description: `Mostra para o usuário o avatar dele ou de outro membro do servidor\nModo de usar:\nMostrando o próprio avatar: *${config.prefix}avatar*\nMostrando o avatar de outro membro do servidor: *${config.prefix}avatar @membro*\nou: *${config.prefix}avatar usernameDoMembro*`,

  async execute(message, args, comando, client, prefix) {
    const membro = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => args.length === 0 ? member.id === message.member.id : member.user.tag.toLowerCase().includes(args.join(' ').toLowerCase())) || message.guild.members.cache.find(member => args.length === 0 ? member.id === message.member.id : member.displayName.toLowerCase().includes(args.join(' ').toLowerCase())) || message.member // Busca um membro que bata com alguma das informações passadas nos argumentos, caso não encontre, retorna o próprio autor da mensagem
    const { run } = require('../utils/errorAlert.js') // importa a função de dentro do errorAlert.js
    const embed = new Discord.MessageEmbed() // Cria a embed
      .setColor(membro.displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Avatar de ${membro.displayName}`)
      .setTimestamp()
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setImage(membro.user.displayAvatarURL({size: 1024, dynamic: true}))
    run(message, client, embed, emojis.alertcircleamarelo) // Envia a embed ou adiciona um emoji de alerta
  }
}
