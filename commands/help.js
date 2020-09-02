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

    async execute(message, args, comando, client, prefix) {
        const botMembro = message.guild.member(client.user.id)
        const permissoesBot = message.channel.memberPermissions(botMembro)
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        const tiposComandos = [...new Set(client.commands.map(comando => comando.type))]
        const emojiArray = [
            'number0blue:747879954875809952', 'number1blue:747879954464637039', 'number2blue:747879955773390859', 'number3blue:747879956130037770', 'number4blue:747879955907477544', 'number5blue:747879955773259907', 'number6blue:747879956100677665', 'number7blue:747879955618332845', 'number8blue:747879956054540439', 'number9blue:747879956012466336', 'number10blue:7478799559873006020602'
        ]
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
                    helpEmbed.addField(`<:${emojiArray[i]}> | ${tiposComandos[i]}`, `Exemplo: ${prefix}${exTiposComandos[0]}`)
                } else {
                    helpEmbed.addField(`<:fastforwardblue:747879944192917635> | Mais tipos`, `Exemplo: ${prefix}${tiposComandos[i]}`)
                    i = Infinity
                }
            }
        await message.author.send(helpEmbed)
        .then((msg) => {
            for(let i = 0; i < tiposComandos.length; i++) {
                if(i <= 10) {
                    msg.react(emojiArray[i])
                } else {
                    msg.react('fastforwardblue:747879944192917635')
                    i = Infinity
                }
            }
            message.react('send:745271212799950899')
        }, (error) => {
            if(podeEnviarMsg) {
                message.reply(`Você pode conferir todos os comandos do ${client.user.username} em: ${config.commandsURL}\nOu se preferir, libere o envio de mensagens diretas e execute novamente o comando ${prefix}help`)
            } else if(podeAddReactions) {
                message.react('slashred:747879954305253468')
            }
        })
    }
}
  