const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "clear",
  aliases: ["clean", "limpar", "limpe", "clearchannel", "clearmessages", "clearmensagens", "cleanchannel", "cleanmessages", "deletarmensagens"],
  type: "Moderação", 
  description: `O comando clean é usado para limpar até 100 mensagens de um canal (apenas mensagens com menos de 2 semanas de enviadas)`,

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    if(!message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) return run(message, client, `<:${emojis.alertcircleamarelo}> Eu não possuo a permissão de gerenciar mensagens neste canal!`, emojis.alertcircleamarelo)
    if(!message.channel.memberPermissions(message.member).has("MANAGE_MESSAGES")) return run(message, client, `<:${emojis.alertcircleamarelo}> Você não possui permissão de gerenciar mensagens neste canal!`, emojis.alertcircleamarelo)
    if(!args) return run(message, client, `<:${emojis.helpcircleblue}> Digite a quantidade de mensagens a serem deletadas!`, emojis.helpcircleblue)
    
    const qtd = Number(args[0])

    if(isNaN(qtd) || qtd > 100 || qtd < 2) return run(message, client, `<:${emojis.alertcircleamarelo}> Digite um valor válido de mensagens a serem deletadas (entre 2 e 100)!`, emojis.alertcircleamarelo)

    message.channel.bulkDelete(qtd, true).then(msgs => {
      if(qtd - msgs.size > 0) message.channel.send(`${qtd-msgs.size} mensagens não foram deletadas pois tinham mais de duas semanas!`)
    })
  }
}