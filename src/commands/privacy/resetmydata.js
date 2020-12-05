const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "resetmydata", 
  aliases: ["resetarmeusdados", "resetardados", "resetdados", "resetadados", "zerardados", "zerarmeusdados"],
  type: "Geral",
  description: `Use este comando caso queira resetar completamente seus dados no nosso banco de dados, voltando todas as informações para o padrão!\nEsse comando resetará todos os itens que você possui comprados, assim como toda a sua pontuação e dinheiro! Use com cuidado!`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    // Cooldown
    if (!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 600000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((600000 - parseInt(Date.now() - this.cooldown[message.author.id].timestamp)) / 60000)} minutos para usar este comando novamente!`, emojis.datecronometro)
    } else if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 600000) {
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }

    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")

    if(!podeEnviarMsg)return run(message, client, `Preciso poder enviar mensagens`, emojis.xcirclered);

    run(message, client, `<:${emojis.alertcircleamarelo}> ATENÇÃO!! Esta ação é irreversível, caso a conclua seus dados voltarão todos ao padrão e você perderá tudo o que possui no inventário!\nPara continuar com essa ação, envie a seguinte mensagem abaixo: \`Eu quero resetar os meus dados no bot ${client.user.username}.\`. (Siga a pontuação e as letras maiúsculas)\n\nVocê tem 60 segundos para responder a essa ação, caso o tempo acabe ou você responda com uma mensagem não correspondente ao informado acima, a ação será cancelada e você só poderá usar este comando novamente daqui a dez minutos!`, emojis.alertcircleamarelo)

    const collector = message.channel.createMessageCollector(msg => msg.author.id === message.author.id, { max: 1, time: 60000 })
    collector.on('collect', async msg => {
      if(msg.content === `Eu quero resetar os meus dados no bot ${client.user.username}.`) {
        connection.query(`select iduser from users where iduser = '${message.author.id}'`, (err, result) => {
          if(err) throw err;
          if(result[0] === undefined) return;
          connection.query(`update users set money = '0', bankmoney = '0', daily_timestamp = '0', consecutive_days = '0', emprego = '0', score_style_global_em_uso = '0', reducao_taxa = '0' where iduser = '${message.author.id}'`)
        })
        connection.query(`delete from compras_locais where userid = '${message.author.id}'`)
        connection.query(`delete from compras_globais where userid = '${message.author.id}'`)
        connection.query(`select id from score_per_server where userid = '${message.author.id}'`, (err, result) => {
          if(err) throw err;          
          if(result[0] === undefined) return;
          connection.query(`update score_per_server set score = '0', money = '0', score_style_em_uso = '0', reducao_taxa = '0' where userid = '${message.author.id}'`)
        })

        return run(message, client, `<:${emojis.circlecheckverde}> ${message.author}, todos os seus dados foram resetados!`)
      } else {
        run(message, client, `<:${emojis.xcirclered}> ${message.author}, seus dados não foram resetados, tente novamente daqui a dez minutos caso ainda queira!`, emojis.xcirclered)
      }
    })

    collector.on('end', async (collected, reason) => {
      if(reason === 'limit') return;
      run(message, client, `<:${emojis.xcirclered}> ${message.author}, seus dados não foram resetados, tente novamente daqui a dez minutos caso ainda queira!`, emojis.xcirclered)
    })
  }
}