const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "viewmydata",
  aliases: ["vermeusdados", "mydata", "meusdados"],
  type: "Geral",
  description: `Veja na sua DM todos os dados que você tem registrados em nosso banco de dados!`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if (!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 10000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((10000 - parseInt(Date.now() - this.cooldown[message.author.id].timestamp)) / 1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 10000) {
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    const { getUserData } = require('../utils/getUserData.js')
    const dados = await getUserData(connection, message.author)
    if (!dados) return run(message, client, `<:${emojis.xcirclered}> Você não possui nenhum tipo de cadastro em nosso banco de dados!`, emojis.xcirclered)
    let formatedData = '';
    const chaves = Object.keys(dados[0])
    const valores = Object.values(dados[0])
    formatedData += `SEUS DADOS GLOBAIS\n\n`
    for (let i = 0; i < chaves.length; i++) {
      formatedData += `"${chaves[i]}": '${valores[i]}'\n`
    }
    if (dados[1]) {
      formatedData += `\n\nSEUS DADOS POR SERVIDOR\n\n`
      for (let i = 0; i < dados[1].length; i++) {
        formatedData += `"${dados[1][i].serverid}" = {\n`
        const sChaves = Object.keys(dados[1][i])
        const sValues = Object.values(dados[1][i])
        for (let c = 1; c < sChaves.length; c++) {
          formatedData += `  "${sChaves[c]}": '${sValues[c]}'\n`
        }
        formatedData += `},\n`
      }
    }
    if (formatedData.length > 2000) formatedData = formatedData.slice(0, 1800) + '... é amigo, parece que isso aqui ficou grande demais, para ver seus dados completos acesse ' + config.repositorio
    message.author.send(`\`\`\`${formatedData}\`\`\``).then(() => {
      if (podeAddReactions) message.react(emojis.send)
    }, () => {
      run(message, client, `<:${emojis.xcirclered}> Para ver seus dados habilite o envio de mensagens diretas!`, emojis.xcirclered)
    })
  }
}