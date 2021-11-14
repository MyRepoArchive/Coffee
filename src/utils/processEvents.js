const Discord = require('discord.js');
const hex = require('../../colors.json');
const config = require('../../info.json');

module.exports = {
  async ur(reason, client) {
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const embedError = new Discord.MessageEmbed()
        .setColor(hex.yellow)
        .setTitle(`<:xcirclered:747879954708037662> Aconteceu um erro: **unhandledRejection**`)
        .setDescription(reason.stack)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL())
    logErrorChannel.send(embedError)
    console.error(reason)
  },
  async wa(warning, client) {
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const embedError = new Discord.MessageEmbed()
        .setColor(hex.yellow)
        .setTitle(`<:alertcircleamarelo:747879938207514645> Aconteceu um aviso: **Warning**`)
        .setDescription(`${warning.name}\n\n${warning.message}\n\n${warning.stack}`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL())
    logErrorChannel.send(embedError)
    console.error(warning, warning.name, warning.message, warning.stack)
  }
}