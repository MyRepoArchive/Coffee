const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "botemojis",
  name2: "emojisbot",
  type: "Informativo",
  description: "Mostra a quantidade de emojis em que o bot tem acesso",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js');
    run(message, client, `<:${emojis.emoji}> Tenho acesso a **${client.emojis.cache.size}** emojis`, emojis.alertcircleamarelo)
  }
}