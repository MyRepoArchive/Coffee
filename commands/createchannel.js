const Discord = require('discord.js') // Lib
const hex = require('../colors.json') // Json das cores
const config = require('../info.json');

module.exports = {
    // Maneiras que podem ser chamado o comando
    name: "createchannel",
    name2: "criarcanal",
    name3: "newchannel",
    name4: "criacanal",
    name5: "novocanal",
    name6: "gerarcanal",
    name7: "generatechannel",
    type: "Gerenciamento",
    description: `Comando que cria um novo canal no servidor em que foi executado!\nModo de usar: **${config.prefix}createChannel nome-do-canal voice**\n\n*OBS: Se você quiser alterar o tipo do canal mas quiser manter o nome padrão que ele gera, use **auto** entre crases no lugar do nome do canal.*`,
    // Execução do comando
    async execute(message, args, comando, client) {
        const botMembro = message.guild.member(client.user.id)
        const permissoesBot = message.channel.memberPermissions(botMembro)
        const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES")
        const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
        const podeCriarInvite = permissoesBot.has("CREATE_INSTANT_INVITE");
        const usernameFormatado = message.author.username.split(/ +/g).join('-')
        const logErrorExecucaoChannel = client.channels.cache.get(config.logErroExecucao);
        // Verifica se o usuário definiu o nome e o tipo do canal, logo após passa seus argumentos para minúsculas
        if(args[0] === undefined || args[0] === '`auto`' ) {args[0] = `new-channel-by-${usernameFormatado}`}
        if(args[1] === undefined) {args[1] = 'text'}
        args[0] = args[0].toLowerCase()
        args[1] = args[1].toLowerCase()
        // Verifica se o usuário pode fazer essa ação
        if(!message.member.hasPermission("MANAGE_CHANNELS")) {
            if(podeEnviarMsg) {
                message.reply(`Você não tem permissão para criar novos canais!`)
            } else if(podeAddReactions) {
                message.react('⛔')
            }
            return 
        }
        // Verifica se o bot tem permissão para criar canais dentro do servidor
        if(!message.guild.members.cache.get(client.user.id).hasPermission('MANAGE_CHANNELS')) {
            if(podeEnviarMsg) {
                message.reply(`Eu infelismente não tenho permissão para manipular canais dentro deste servidor😕`)
            } else if (podeAddReactions) {
                message.react('⛔')
            }
            return
        }
        // Verifica se o servidor já possui o número máximo de canais
        if(message.guild.channels.cache.size >= 500) {
            if(podeEnviarMsg) {
                message.reply(`O servidor já possui o número máximo de canais!`)
            } else if(podeAddReactions) {
                message.react('❗')
            }
            return 
        }
        // Faz algumas conversões de palavras para melhorar o uso para o usuário!
        if(args[1] === 'texto' || args[1] === 'escrito' || args[1] === 'chat') {args[1] = 'text'}
        if(args[1] === 'voz' || args[1] === 'falar' || args[1] === 'voip' || args[1] === 'conversa' || args[1] === 'som' || args[1] === 'musica' || args[1] === 'music' || args[1] === 'música') {args[1] = 'voice'}
        // Verifica se o segundo argumento do usuário é um tipo válido de canal
        if(args[1] !== 'text' && args[1] !== 'voice') { 
            if(podeEnviarMsg) {
                message.reply(`Tipo de canal desconhecido! Use **"voice"** ou **"text"**!\nSe quiser criar um canal com mais de uma palavra em seu nome, use **"-"** no lugar dos espaços!\n EXEMPLO: **!${comando} nome-com-mais-de-uma-palavra text**`)
            } else if(podeAddReactions) {
                message.react('❌')
            }
            return
        };

        await message.guild.channels.create(args[0], { type: args[1] }).catch(error => {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(hex.orange)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setTitle(`Erro ao executar comando **${comando}**`)
                .setDescription(`Houve um erro ao executar a ação **message.guild.channels.create(args[0], { type: args[1] })**`)
                .addField(`Servidor:`, `**${message.guild.name}**`)
                .addField(`Quem executou:`, `**${message.author.tag}\n${message.author.id}**`)
                .addField(`Permissões:`, `**${message.member.permissions.toArray().join('\n')}**`)
                .addField(`Dono do servidor:`, `**${message.guild.owner.user.tag}**`)
                .addField(`Erro:`, error)
                .setThumbnail(message.guild.iconURL())
                .setTimestamp()
                .setFooter(`${client.user.tag} log sistem`, client.user.displayAvatarURL())
            if(podeEnviarMsg) {
                message.reply('Houve um erro ao executar esse comando! A Equipe já foi informada!')
            } else if(podeAddReactions) {
                message.react('❌')
            }
            console.log(error);
            if(podeCriarInvite) {
                message.channel.createInvite({ maxAge: 0, reason: `Houve um erro ao executar um comando do bot ${client.user.tag} e os administradores precisam ser chamados para averiguar o problema` }).then(invite => {
                    errorEmbed.setURL(`https://discord.gg/${invite.code}`)
                })
            }
            logErrorExecucaoChannel.send(errorEmbed)
        })
        const canais = await message.guild.channels.cache.filter(channel => channel.name === args[0]).array()
        const embed = new Discord.MessageEmbed()
            .setColor(hex.green)
            .setTitle("Novo canal criado")
            .setDescription(`Foi criado o canal de ID **${canais[canais.length-1].id}**`)
            .addField('Nome', args[0])
        // Verifica se já existe um canal de mesmo nome para exibir um alerta na criação
        if(message.guild.channels.cache.filter(canal => canal.name === args[0]).filter(canal => canal.type === args[1]).size > 1) {
            embed
                .setColor(hex.orangered)
                .addField('ALERTA', 'Já existe um canal de mesmo nome neste servidor!')
                if(!podeEnviarMsg && podeAddReactions) {
                    message.react('⚠')
                }
        }
        if(podeEnviarMsg) {
            message.channel.send(`<#${canais[canais.length-1].id}>`)
            message.channel.send(embed)
        } else if(podeAddReactions) {
            message.react('✅')
        }
    }
}