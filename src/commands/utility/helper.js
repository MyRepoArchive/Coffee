const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores
const config = require('../info.json')
const emojis = require('../emojis.json');

module.exports = {
    name: "ajuda",
    aliases: ["help", "comandos", "commands"],
    type: "Geral",
    description: "Comando usado quando o usuário necessita de ajuda ou precisa saber os comandos do bot",
    async execute(message, args, comando, client, prefix) {
        const botMembro = message.guild.member(client.user.id)
        const permissoesBot = message.channel.memberPermissions(botMembro)
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        const tiposComandos = [...new Set(client.commands.filter(comando => comando.type !== 'Dev commands').map(comando => comando.type))]
        const emojiArray = [
            emojis.number0blue, emojis.number1blue, emojis.number2blue, emojis.number3blue, emojis.number4blue, emojis.number5blue, emojis.number6blue, emojis.number7blue, emojis.number8blue, emojis.number9blue, emojis.number10blue
        ]
        if (tiposComandos.map(x => x.toLowerCase()).includes(args.join(' ').toLowerCase())) {
            const tipoComando = tiposComandos.find(x => x.toLowerCase() === args.join(' ').toLowerCase())
            const comandosDoTipo = client.commands.filter(comando => comando.type === tipoComando).map(comando => comando.name)
            if(podeEnviarMsg) {
                message.channel.send(`\`\`\`${comandosDoTipo.join(', ')}\`\`\``)
                return;
            }
        }
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
                    helpEmbed.addField(`<:${emojis.fastforwardblue}> | Mais tipos`, `Exemplo: ${prefix}${tiposComandos[i]}`)
                    i = Infinity
                }
            }
        await message.author.send(helpEmbed)
        .then((msg) => {
            for(let i = 0; i < tiposComandos.length; i++) {
                if(i <= 10) {
                    msg.react(emojiArray[i])
                } else {
                    msg.react(emojis.fastforwardblue)
                    i = Infinity
                }
            }
            message.react(emojis.send)
        }, (error) => {
            if(podeEnviarMsg) {
                message.reply(`Você pode conferir todos os comandos do ${client.user.username} em: ${config.commandsURL} ou usando ${prefix}commandList\nOu se preferir, libere o envio de mensagens diretas e execute novamente o comando ${prefix}help`)
            } else if(podeAddReactions) {
                message.react(emojis.xcirclered)
            }
        })
    }
}
  