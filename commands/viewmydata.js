const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "viewmydata",
  name2: "vermeusdados",
  name3: "mydata",
  name4: "meusdados",
  type: "Geral",
  description: `Veja na sua DM todos os dados que você tem registrados em nosso banco de dados!`,

  async execute(message, args, comando, client, prefix, connection) {
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    const { run } = require('../utils/errorAlert.js')
    const { getUserData } = require('../utils/getUserData.js')
    const dados = await getUserData(connection, message.author)
    if(!dados) return run(message, client, `<:${emojis.xcirclered}> Você não possui nenhum tipo de cadastro em nosso banco de dados!`, emojis.xcirclered)
    const chaves = Object.keys(dados)
    const valores = Object.values(dados)
    let formatedData = '';
    for(let i = 0; i < chaves.length; i++) {
      formatedData += `"${chaves[i]}": '${valores[i]}'\n`
    }
    message.author.send(`\`\`\`${formatedData}\`\`\``).then(() => {
      if(podeAddReactions) message.react(emojis.send)
    }, () => {
      run(message, client, `<:${emojis.xcirclered}> Para ver seus dados habilite o envio de mensagens diretas!`, emojis.xcirclered)
    })
  }
}