const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores

module.exports = {
    // Maneiras que podem ser chamado o comando
    name: "newchannel",
    name2: "createchannel",
    name3: "criarcanal",
    name4: "criacanal",
    name5: "novocanal",
    name6: "gerarcanal",
    name7: "generatechannel",
    type: "Gerenciamento",
    description: "Cria um canal novo no servidor",
    // Execução do comando
    async execute(message, args, comando, client) {
        const usernameFormatado = message.author.username.split(/ +/g).join('-')
        // Verifica se o usuário definiu o nome e o tipo do canal, logo após passa seus argumentos para minúsculas
        if(args[0] === undefined || args[0] === '`auto`' ) {args[0] = `new-channel-by-${usernameFormatado}`}
        if(args[1] === undefined) {args[1] = 'text'}
        args[0] = args[0].toLowerCase()
        args[1] = args[1].toLowerCase()

        // Verifica se o usuário pode fazer essa ação
        if(!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.reply(`Você não tem permissão para criar novos canais!`)
        }

        // Verifica se o bot tem permissão para criar canais dentro do servidor
        if(!message.guild.members.cache.get(client.user.id).hasPermission('MANAGE_CHANNELS')) {
            return message.reply(`Eu infelismente não tenho permissão para manipular canais dentro deste servidor😕`)
        }

        // Verifica se o servidor já possui o número máximo de canais
        if(message.guild.channels.cache.size >= 500) {
            return message.reply(`O servidor já possui o número máximo de canais!`)
        }
        
        // Faz algumas conversões de palavras para melhorar o uso para o usuário!
        if(args[1] === 'texto' || args[1] === 'escrito' || args[1] === 'chat') {args[1] = 'text'}
        if(args[1] === 'voz' || args[1] === 'falar' || args[1] === 'voip' || args[1] === 'conversa' || args[1] === 'som' || args[1] === 'musica' || args[1] === 'music' || args[1] === 'música') {args[1] = 'voice'}

        // Verifica se o segundo argumento do usuário é um tipo válido de canal
        if(args[1] !== 'text' && args[1] !== 'voice') { return message.reply(`Tipo de canal desconhecido! Use **"voice"** ou **"text"**!\nSe quiser criar um canal com mais de uma palavra em seu nome, use **"-"** no lugar dos espaços!\n EXEMPLO: **!${comando} nome-com-mais-de-uma-palavra text**`)};

        // Verifica se já existe um canal de mesmo nome para exibir um alerta na criação
        if(message.guild.channels.cache.filter(canal => canal.name === args[0]).find(canal => canal.type === args[1]) !== undefined) {
            await message.guild.channels.create(args[0], { type: args[1]})
            const canais = message.guild.channels.cache.filter(channel => channel.name === args[0]).array()
            const embed = new Discord.MessageEmbed()
                .setColor(hex.orangered)
                .setTitle("Novo canal criado")
                .setDescription(`Foi criado o canal de ID **${canais[canais.length-1].id}**`)
                .addFields(
                    {name: 'ALERTA', value: 'Já existe um canal de mesmo nome neste servidor!'},
                    {name: 'Nome', value: args[0]},
                )
            message.channel.send(embed)
            message.channel.send(`<#${canais[canais.length-1].id}>`)
            return;
        }

        await message.guild.channels.create(args[0], { type: args[1] })
        const canais = await message.guild.channels.cache.filter(channel => channel.name === args[0]).array()
        const embed = new Discord.MessageEmbed()
            .setColor(hex.green)
            .setTitle("Novo canal criado")
            .setDescription(`Foi criado o canal de ID **${canais[canais.length-1].id}**`)
            .addField('Nome', args[0])
        message.channel.send(`<#${canais[canais.length-1].id}>`)
        message.channel.send(embed)
    }
}