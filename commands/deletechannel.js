const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')

module.exports = {
  name: "deletechannel",
  name2: "deletarcanal",
  name3: "deletecanal",
  name4: "excluircanal",
  name5: "excluacanal",
  name6: "excluirchannel",
  name7: "apagarcanal",
  name8: "apaguecanal",
  name9: "deletechannels",
  name10: "deletarcanais",
  name11: "deletecanais",
  name12: "excluircanais",
  name13: "excluacanais",
  name14: "excluirchannels",
  name15: "apagarcanais",
  name16: "apaguecanais",
  type: "Gerenciamento",
  description: `Você pode utilizar esse comando para deletar um canal de algum servidor que você tenha a devida permissão.\nModo de usar:\nMencionando o canal: *${config.prefix}deletechannel #nome-do-canal*\nDitando o ID do canal: *${config.prefix}deletechannel id_do_canal*`,

  async execute(message, args, comando, client) {
    const mencoes = message.mentions
    const ids = message.content.trim().slice(config.prefix.length + comando.length).split("\\").map(id => id.trim().toLowerCase())
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    if(!message.member.hasPermission("MANAGE_CHANNELS")) {
      if (podeEnviarMsg) {
        message.channel.send(`<:slashred:747879954305253468> ${message.author}, você não pode deletar canais neste servidor!`);
      } else if (podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
    if(!botMembro.hasPermission("MANAGE_CHANNELS")) {
      if (podeEnviarMsg) {
        message.reply(`eu não tenho permissão para banir membros!`);
      } else if (podeAddReactions) {
        message.react('slashred:747879954305253468')
      }
      return;
    }
  }
}