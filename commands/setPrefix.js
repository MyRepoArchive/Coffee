const Discord = require('discord.js');
const hex = require('../colors.json');
const config =  require('../info.json');

module.exports = {
  name: "setprefix",
  name2: "setarprefixo",
  name3: "alterarprefix",
  name4: "alterarprefixo",
  name5: "alterprefix",
  name6: "alterprefixo",
  name7: "changeprefix",
  name8: "changeprefixo",
  type: "Configurações",
  description: `Mude o meu prefixo em algum servidor que você tenha permissão de **administrador** (por padrão meu prefixo é ${config.prefix} )\nOBS: *Meu prefixo deve ter até 3 caracteres!*`,

  async execute(message, args, comando, client, prefix, connection) {
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    let newPrefix = args.join(' '); // Transforma os argumentos do usuários em uma string novamente e salva numa variavl
    if(newPrefix === '\\') newPrefix = '\\\\' // Repassa o valor de contrabarra para duas contrabarra, para evitar erro no comando sql
    if(!message.member.permissions.has("ADMINISTRATOR") && message.author.id !== config.owner) { // Verifica se quem executou o comando é um administrador na guild ou é o dono do bot
      if(podeEnviarMsg) {
        message.channel.send(`<:slashred:747879954305253468> Você não pode mudar meu prefixo neste servidor!`)
      } else if(podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
    if(!newPrefix) { // Verifica se foi fornecido um prefixo válido
      if(podeEnviarMsg) {
        message.channel.send(`<:alertcircleamarelo:747879938207514645> Insira um prefixo válido!`)
      } else if (podeAddReactions) {
        message.react('alertcircleamarelo:747879938207514645')
      }
      return;
    }
    if(newPrefix.length > 3) { // Verifica se o prefixo tem mais de 3 caracteres
      if(podeEnviarMsg) {
        message.channel.send(`<:alertcircleamarelo:747879938207514645> Meu prefixo deve ter até 3 caracteres!`)
      } else if(podeAddReactions) {
        message.react('alertcircleamarelo:747879938207514645')
      }
      return;
    }
    connection.query(`UPDATE servers SET prefix = '${newPrefix}' WHERE (serverid = '${message.guild.id}');`) // Executa a query do mysql passando o novo prefixo para o servidor onde o idserver for compatível com o id da guilda em que foi utilizado o comando
    if(podeEnviarMsg) {
      message.channel.send(`<:circlecheckverde:747879943224033481> Prefixo alterado de \`${prefix}\` para \`${args.join(' ')}\` com sucesso!`)
    } else if(podeAddReactions) {
      message.react('circlecheckverde:747879943224033481')
    }
  }
}