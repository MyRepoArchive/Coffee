const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores
const config = require('../config.json')
const { execute } = require('./ping')

module.exports = {
    name: "ajuda",
    name2: "help",
    name3: "comandos",
    name4: "commands", 
    description: "ajuda",

    async execute(message, args, comando, client) {
        const helpEmbed = new Discord.MessageEmbed() 
            .setColor(hex.white)
            .setURL('https://github.com/joaoscoelho/Coffe') // Aqui você pode colocar algum outro link
            .setAuthor(message.author.tag, (message.author.avatarURL() === null) ? '' : message.author.avatarURL())
            .setTitle(`Central de auto-atendimento ${client.user.username}`)
            .setDescription(`Como posso ajuda Sr(a) ${message.author.username}?`)
            .addFields(
                {name: `1️⃣ - Comandos básicos`, value: `Ex: ${config.prefix}ping`},
                {name: `2️⃣ - Comandos de moderação`, value: `Ex: ${config.prefix}ban`},
                {name: `3️⃣ - Comandos de gerenciamento do servidor`, value: `Ex: ${config.prefix}createChannel`}
            )
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username}`)
        const msg = await message.author.send(helpEmbed);
        await msg.react('1️⃣')
        await msg.react('2️⃣')
        await msg.react('3️⃣')
    }
}
  