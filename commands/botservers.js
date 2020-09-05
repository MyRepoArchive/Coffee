const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "botservers",
  name2: "serversbot",
  type: "Informativo",
  description: "Mostra a quantidade de servidores em que o bot está",

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js');
    run(message, client, `<:${emojis.server2}> Tenho acesso a **${client.guilds.cache.size}** servidores`, emojis.alertcircleamarelo)
  }
}