const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json')
const pad = require('../utils/pad.js')
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
const changeActivity = require('../utils/changeActivity.js')

module.exports = {
  name: "error",

  async execute() {
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const errorEmbed = new Discord.MessageEmbed()
        .setColor(hex.orangered)
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setTitle(`Aconteceu um erro!`)
        .addField(`<:xcirclered:747879954708037662> Erro`, error)
        .addField(`<:edit3blue:747879944369209344> Nome`, error.name)
        .addField(`<:paperblue:747879955895025664> Stack`, error.stack)
        .addField(`<:messagesquareblue:747879951461777448> Mensagem`, error.message)
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logErrorChannel.send(errorEmbed)
    console.log(error)
  }
}