const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json')
const pad = require('../utils/pad.js')
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
const changeActivity = require('../utils/changeActivity.js')

module.exports = {
  name: "messageReactionAdd",

  async execute(client, message, user, connection) {
    const logErrorChannel = client.channels.cache.get(config.logErro);
    if (user.id === client.user.id) return; // Verifica se foi o bot quem adicionou a reação, se for, retorna
    if (user.bot) return; // Verifica se foi um bot quem adicionou a reação, se for, retona
    const errorEmbed = new Discord.MessageEmbed()
        .setColor(hex.orangered)
        .setAuthor(user.username, user.displayAvatarURL())
        .addField(`<:serverblue:747879939734372392> Servidor`, `**${(message.message.guild === null) ? 'Sem servidor (DM)' : message.message.guild.name}**`)
        .addField(`<:userblue:747880223214796941> Quem executou`, `**${user.tag}\n${user.id}**`)
        .addField(`<:messagesquareblue:747879951461777448> Canal`, `**${(message.message.channel.name === undefined) ? '(DM)' : message.message.channel.name}**`)
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    if (client.reactCommands.has(message.emoji.name)) { // Verifica se o bot tiver um comando que responda com o nome do emoji
        try { // Tenta executar o comando
            client.reactCommands.get(message.emoji.name).execute(message, user, client)
        } catch (error) { // Caso não consiga executar, vai logar o erro
            errorEmbed
                .setTitle(`Erro ao executar ação na reação do emoji "${message.emoji.name}"`)
                .setDescription(`<:alertcircleamarelo:747879938207514645> Houve um erro ao reagir com" ${message.emoji.name}"`)
                .addField(`<:xcirclered:747879954708037662> Erro`, error)
            console.log(error);
            logErrorChannel.send(errorEmbed)
        }
    } else if (client.reactCommands.has(message.emoji.identifier)) { // Verifica se o bot tem algum comando que responda com o identifier do emoji
        try { // Tenta executar...
            client.reactCommands.get(message.emoji.identifier).execute(message, user, client)
        } catch (error) { // Loga o erro caso não consiga
            errorEmbed
                .setTitle(`Erro ao executar ação na reação do emoji "<:${message.emoji.identifier}>"`)
                .setDescription(`<:alertcircleamarelo:747879938207514645> Houve um erro ao reagir com "<:${message.emoji.identifier}>"`)
                .addField(`<:xcirclered:747879954708037662> Erro:`, error)
            console.log(error);
            logErrorChannel.send(errorEmbed)
        }
    }
  }
}