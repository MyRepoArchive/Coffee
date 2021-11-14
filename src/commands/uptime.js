const Discord = require('discord.js');
const hex = require('../../colors.json');
const config = require('../../info.json');
const emojis = require('../../emojis.json');

module.exports = {
  name: "uptime",
  aliases: ["tempoativo", "activitytime"],
  type: "Informativo",
  description: `Mostra a quanto tempo o bot está ativo!`,

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    run(message, client, `<:${emojis.dateampulheta}> Estou ativo a **${parseInt(client.uptime/86400000)} Dias, ${parseInt((client.uptime%86400000)/3600000)} Horas e ${parseInt(((client.uptime%86400000)%3600000)/60000)} minutos**`, emojis.alertcircleamarelo)
  }
}