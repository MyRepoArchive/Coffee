const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores
const config = require('../info.json')

module.exports = {
    name: "ajuda",
    name2: "help",
    name3: "comandos",
    name4: "commands",
    type: "Geral",
    description: "ajuda",

    async execute(message, args, comando, client) {
        const botMembro = message.guild.member(client.user.id)
        const permissoesBot = message.channel.memberPermissions(botMembro)
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        const comandosGerais = [...new Set(client.commands.filter(comando => comando.type === 'geral').map(comando => comando.name))]
        const descComandosGerais = [...new Set(client.commands.filter(comando => comando.type === 'geral').map(comando => comando.description))]
        const tiposComandos = [...new Set(client.commands.map(comando => comando.type))]
        const emojiArray = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        const helpEmbed = new Discord.MessageEmbed()
            .setColor(hex.white)
            .setURL(config.commandsURL) // Aqui você pode colocar algum outro link
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(`Central de atendimento ${client.user.username}`)
            .setDescription(`Selecione o tipo de comando que você deseja procurar!`)
            .setTimestamp()
            .setFooter(`Sistema de ajuda ${client.user.username} (1/${(tiposComandos.length % 11 > 0) ? parseInt(tiposComandos.length / 11) + 1 : parseInt(tiposComandos.length / 11)})`)
            for(let i = 0; i < tiposComandos.length; i++) {
                const exTiposComandos = [...new Set(client.commands.filter(comando => comando.type === tiposComandos[i]).map(comando => comando.name))]
                if(i < emojiArray.length) {
                    helpEmbed.addField(`${emojiArray[i]} | ${tiposComandos[i]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
                } else {
                    helpEmbed.addField(`⏩ | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
                    i = Infinity
                }
            }
        await message.author.send(helpEmbed)
        .then((msg) => {
            for(let i = 0; i < tiposComandos.length; i++) {
                if(i <= 10) {
                    msg.react(emojiArray[i])
                } else {
                    msg.react('⏩')
                    i = Infinity
                }
            }
            message.react('✅')
        }, (error) => {
            if(podeEnviarMsg) {
                message.reply(`Você pode conferir todos os comandos do ${client.user.username} em: ${config.commandsURL}\nOu se preferir, libere o envio de mensagens diretas e execute novamente o comando ${config.prefix}help`)
            } else if(podeAddReactions) {
                message.react('❌')
            }
        })
        
        /* await msg.react('1️⃣')
        await msg.react('2️⃣')
        await msg.react('3️⃣') */
    }
}
  