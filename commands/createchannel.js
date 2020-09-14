const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
    // Maneiras que podem ser chamado o comando
    name: "createchannel",
    aliases: ["criarcanal", "newchannel", "criacanal", "novocanal", "gerarcanal", "generatechannel"],
    // Tipo do comando
    type: "Gerenciamento",
    // Descrição do comando
    description: `Comando que cria um novo canal no servidor em que foi executado!\nModo de usar: **${config.prefix}createChannel nome-do-canal voice**\n\n*OBS: Se você quiser alterar o tipo do canal mas quiser manter o nome padrão que ele gera, use **\`\auto\`\** (entre crases) no lugar do nome do canal.*`,
    // Execução do comando
    async execute(message, args, comando, client, prefix) {
        const  { run } = require('../utils/errorAlert.js');
        const botMembro = message.guild.me // O membro que representa o bot dentro do servidor em que foi usado o comando
        const permissoesBot = message.channel.memberPermissions(botMembro) // Todos as permissões do bot naquele canal
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        const usernameFormatado = message.author.username.split(/ +/g).join('-')
        // Verifica se o usuário definiu o nome e o tipo do canal, logo após passa seus argumentos para minúsculas
        if(args[0] === undefined || args[0] === '`auto`' ) {args[0] = `new-channel-by-${usernameFormatado}`}
        if(args[1] === undefined) {args[1] = 'text'}
        args[0] = args[0].toLowerCase()
        args[1] = args[1].toLowerCase()
        // Verifica se o usuário pode fazer essa ação
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return run(message, client, `<:${emojis.slashred}> ${message.author}, você não tem permissão para criar novos canais!`, emojis.slashred) 
            
        // Verifica se o bot tem permissão para criar canais dentro do servidor
        if(!message.guild.members.cache.get(client.user.id).hasPermission('MANAGE_CHANNELS')) return run(message, client, `<:${emojis.slashred}> ${message.author}, eu infelismente não tenho permissão para manipular canais dentro deste servidor😕`, emojis.slashred)
        // Verifica se o servidor já possui o número máximo de canais
        if(message.guild.channels.cache.size >= 500)  return run(message, client, `<:${emojis.alertcircleamarelo}> ${message.author}, o servidor já possui o número máximo de canais!`, emojis.alertcircleamarelo) 

        // Faz algumas conversões de palavras para melhorar o uso para o usuário!
        if(args[1] === 'texto' || args[1] === 'escrito' || args[1] === 'chat') {args[1] = 'text'}
        if(args[1] === 'voz' || args[1] === 'falar' || args[1] === 'voip' || args[1] === 'conversa' || args[1] === 'som' || args[1] === 'musica' || args[1] === 'music' || args[1] === 'música') {args[1] = 'voice'}
        // Verifica se o segundo argumento do usuário é um tipo válido de canal
        if(args[1] !== 'text' && args[1] !== 'voice') return run(message, client, `<:${emojis.helpcircleblue}> ${message.author}, tipo de canal desconhecido! Use **"voice"** ou **"text"**!\nSe quiser criar um canal com mais de uma palavra em seu nome, use **"-"** no lugar dos espaços!\n EXEMPLO: **${prefix}${comando} nome-com-mais-de-uma-palavra text**`, emojis.helpcircleblue)

        await message.guild.channels.create(args[0], { type: args[1] })
        const canais = await message.guild.channels.cache.filter(channel => channel.name === args[0]).array()
        const embed = new Discord.MessageEmbed()
            .setColor(hex.green2)
            .setTitle(`<:${emojis.circlecheckverde}> Novo canal criado`)
            .setDescription(`${args[1] === 'text' ? `<:${emojis.textchannelclaro}>` : `<:${emojis.voicechannelclaro}>`} Foi criado o canal de ID **${canais[canais.length-1].id}**`)
            .addField(`<:${emojis.edit3blue}> Nome`, `${args[1] === 'text' ? `<:${emojis.textchannelclaro}>` : `<:${emojis.voicechannelclaro}>`} ${args[0]}`)
        // Verifica se já existe um canal de mesmo nome para exibir um alerta na criação
        if(message.guild.channels.cache.filter(canal => canal.name === args[0]).filter(canal => canal.type === args[1]).size > 1) {
            embed
                .setColor(hex.orangered)
                .addField(`<:${emojis.alertcircleamarelo}> ALERTA`, 'Já existe um canal de mesmo nome neste servidor!')
                if(!podeEnviarMsg && podeAddReactions) {
                    message.react(emojis.alertcircleamarelo)
                }
        }
        if(podeEnviarMsg) {
            message.channel.send(`<#${canais[canais.length-1].id}>`, embed)
        } else if(podeAddReactions) {
            message.react(emojis.circlecheckverde)
        }
    }
}