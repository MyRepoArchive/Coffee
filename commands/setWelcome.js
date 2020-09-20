const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "setwelcome",
  aliases: ["setbemvindo", "setarbemvindo", "setbemvindos", "setarwelcome", "bemvindos", "bemvindo", "definirwelcome", "definirbemvindos", "definirbemvindo"],
  type: "Configurações",
  description: `Use este comando para definir em qual canal do seu servidor o bot deve enviar a mensagem de bem vindo!\nPor padrão o bot não tem um canal de bem-vindos definido.`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 60000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((60000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 60000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }

    if(!message.member.hasPermission("MANAGE_GUILD")) return run(message, client, `<:${emojis.slashred}> Você não têm permissão de gerenciar servidor para poder usar este comando!`, emojis.slashred)

    const canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(channel => channel.name.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.channels.cache.find(channel => channel.name.toLowerCase().includes(args.join(' ').toLowerCase())) || message.channel
    
    if(canal.type !== 'text') return run(message, client, `<:${emojis.xcirclered}> Você deve citar um canal de texto como canal de bem vindos!`)

    connection.query(`update servers set welcome_channel = '${canal.id}' where serverid = '${message.guild.id}'`)
    
    run(message, client, `<:${emojis.circlecheckverde}> Foi setado o canal ${canal} como canal de bem vindos!`)
  }
}