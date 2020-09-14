const Discord = require('discord.js');
const hex = require('../colors.json');
const config =  require('../info.json');
const emojis = require('../emojis.json')

module.exports = {
  name: "setprefix",
  aliases: ["setarprefixo", "alterarprefix", "alterarprefixo", "alterprefix", "alterprefixo", "changeprefix", "changeprefixo"],
  type: "Configurações",
  description: `Mude o meu prefixo em algum servidor que você tenha permissão de **administrador** (por padrão meu prefixo é ${config.prefix} )\nOBS: *Meu prefixo deve ter até 3 caracteres!*`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 10000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((10000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 10000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const { prefixs } = require('../utils/prefix.js')
    let newPrefix = args.join(' '); // Transforma os argumentos do usuários em uma string novamente e salva numa variavl
    if(!message.member.permissions.has("ADMINISTRATOR") && message.author.id !== config.owner) return run(message, client, `<:${emojis.slashred}> Você não pode mudar meu prefixo neste servidor!`, emojis.slashred)
    if(!newPrefix) return run(message, client, `<:${emojis.alertcircleamarelo}> Insira um prefixo válido!`, emojis.alertcircleamarelo)
    if(newPrefix.length > 3) return run(message, client, `<:${emojis.alertcircleamarelo}> Meu prefixo deve ter até 3 caracteres!`, emojis.alertcircleamarelo)
    connection.query('UPDATE servers SET prefix = ? WHERE serverid = ?;', [newPrefix, message.guild.id]) // Executa a query do mysql passando o novo prefixo para o servidor onde o idserver for compatível com o id da guilda em que foi utilizado o comando
    prefixs[message.guild.id] = newPrefix
    run(message, client, `<:${emojis.circlecheckverde}> Prefixo alterado de \`${prefix}\` para \`${args.join(' ')}\` com sucesso!`, emojis.circlecheckverde)
  }
}