const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores
const config = require('../info.json')

module.exports = {
    name: "ajuda",
    name2: "help",
    name3: "comandos",
    name4: "commands",
    type: "Geral",
    description: "Comando usado quando o usuário necessita de ajuda ou precisa saber os comandos do bot",

    async execute(message, args, comando, client) {
        const botMembro = message.guild.member(client.user.id)
        const permissoesBot = message.channel.memberPermissions(botMembro)
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        const tiposComandos = [...new Set(client.commands.map(comando => comando.type))]
        const emojiArray = ['number0:746000414020862003', 'number1:746000414184570930', 'number2:746000414259806229', 'number3:746000414335303751', 'number4:746000414276714526', 'number5:746000414217994370', 'number6:746000414310137956', 'number7:746000413542580345', 'number8:746000414201085962', 'number9:746000414012473386', 'number10:746000414985420810']
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
                    helpEmbed.addField(`<:${emojiArray[i]}> | ${tiposComandos[i]}`, `Exemplo: ${config.prefix}${exTiposComandos[0]}`)
                } else {
                    helpEmbed.addField(`<:fastforward:745272739463561246> | Mais tipos`, `Exemplo: ${config.prefix}${tiposComandos[i]}`)
                    i = Infinity
                }
            }
        await message.author.send(helpEmbed)
        .then((msg) => {
            for(let i = 0; i < tiposComandos.length; i++) {
                if(i <= 10) {
                    msg.react(emojiArray[i])
                } else {
                    msg.react('fastforward:745272739463561246')
                    i = Infinity
                }
            }
            message.react('send:745271212799950899')
        }, (error) => {
            if(podeEnviarMsg) {
                message.reply(`Você pode conferir todos os comandos do ${client.user.username} em: ${config.commandsURL}\nOu se preferir, libere o envio de mensagens diretas e execute novamente o comando ${config.prefix}help`)
            } else if(podeAddReactions) {
                message.react('slash:745761670340804660')
            }
        })
    }
}
  