const { description, execute } = require("./ping")
const Discord = require('discord.js')
const hex = require('../colors.json')

module.exports = {
    name: "newchannel",
    name2: "createchannel",
    name3: "criarcanal",
    name4: "criacanal",
    name5: "novocanal",
    name6: "gerarcanal",
    name7: "generatechannel",
    description: "Cria um canal novo no servidor",
    async execute(message, args, comando) {
        if(args[0] === undefined) {args[0] = `new-channel-by-${message.author.username}`}
        if(args[1] === undefined) {args[1] = 'text'}
        args[0] = args[0].toLowerCase()
        args[1] = args[1].toLowerCase()
        
        if(!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.reply(`Você não tem permissão para criar novos canais!`)
        }
        
        if(args[1] === 'texto' || args[1] === 'escrito' || args[1] === 'chat') {args[1] = 'text'}
        if(args[1] === 'voz' || args[1] === 'falar' || args[1] === 'voip' || args[1] === 'conversa' || args[1] === 'som' || args[1] === 'musica' || args[1] === 'music' || args[1] === 'música') {args[1] = 'voice'}
        
        if(args[1] !== 'text' && args[1] !== 'voice') { return message.reply(`Tipo de canal desconhecido! Use **"voice"** ou **"text"**!\nSe quiser criar um canal com mais de uma palavra em seu nome, use **"-"** no lugar dos espaços!\n EXEMPLO: **!${comando} nome-com-mais-de-uma-palavra text**`)};
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
        const canais = message.guild.channels.cache.filter(channel => channel.name === args[0]).array()
        const embed = new Discord.MessageEmbed()
            .setColor(hex.orangered)
            .setTitle("Novo canal criado")
            .setDescription(`Foi criado o canal de ID **${canais[canais.length-1].id}**`)
            .addField('Nome', args[0])
        message.channel.send(`<#${canais[canais.length-1].id}>`)
        message.channel.send(embed)
    }
}