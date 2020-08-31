const fs = require('fs'); // Requerimento do fileSystem
const Discord = require('discord.js'); // Requerimento da biblioteca Discord.js
const client = new Discord.Client(); // Criação do Client (bot)
const config = require("./info.json"); // Requerimento do arquivo config, que tem diversas informações pertinentes para o funcionamento do bot
const hex = require('./colors.json'); // Requerimento de um json de cores para facilitar na criação de embeds 
const Data = new Date; // Salva o momento em que o bot foi iniciado
// CORES PARA COLORIR TERMINAL
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
// 0 = reset; 1 = black; 2 = red; 3 = green; 4 = yellow; 5 = roxo; 6 = magenta; 7 = cyan; 8 = white;
client.commands = new Discord.Collection(); // Collection com os comandos do bot
client.reactCommands = new Discord.Collection(); // Collection com os comandos por reação do bot
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Todos os arquivos JS da pasta ./commands
const reactCommandFiles = fs.readdirSync('./reactCommands').filter(file => file.endsWith('.js')); // Todos os arquivos JS da pasta ./reactCommands

for (const file of commandFiles) { // Para cada arquivo da pasta commands vai ser setado alguns nomes
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    client.commands.set(command.name2, command);
    client.commands.set(command.name3, command);
    client.commands.set(command.name4, command);
    client.commands.set(command.name5, command);
    client.commands.set(command.name6, command);
    client.commands.set(command.name7, command);
    client.commands.set(command.name8, command);
    client.commands.set(command.name9, command);
    client.commands.set(command.name10, command);
    client.commands.set(command.name11, command);
    client.commands.set(command.name12, command);
    client.commands.set(command.name13, command);
    client.commands.set(command.name14, command);
    client.commands.set(command.name15, command);
    client.commands.set(command.name16, command);
    client.commands.set(command.name17, command);
    client.commands.set(command.name18, command);
    client.commands.set(command.name19, command);
    client.commands.set(command.name20, command);
    client.commands.set(command.name21, command);
    client.commands.set(command.name22, command);
    client.commands.set(command.name23, command);
    client.commands.set(command.name24, command);
    client.commands.set(command.name25, command);
}

for (const file of reactCommandFiles) { // Para cada arquivo da pasta reactCommands vai ser setado alguns nomes
    const reactCommand = require(`./reactCommands/${file}`);
    client.reactCommands.set(reactCommand.name, reactCommand);
    client.reactCommands.set(reactCommand.name2, reactCommand);
    client.reactCommands.set(reactCommand.name3, reactCommand);
    client.reactCommands.set(reactCommand.name4, reactCommand);
    client.reactCommands.set(reactCommand.name5, reactCommand);
    client.reactCommands.set(reactCommand.name6, reactCommand);
    client.reactCommands.set(reactCommand.name7, reactCommand);
    client.reactCommands.set(reactCommand.name8, reactCommand);
    client.reactCommands.set(reactCommand.name9, reactCommand);
    client.reactCommands.set(reactCommand.name10, reactCommand);
    client.reactCommands.set(reactCommand.name11, reactCommand);
    client.reactCommands.set(reactCommand.name12, reactCommand);
    client.reactCommands.set(reactCommand.name13, reactCommand);
    client.reactCommands.set(reactCommand.name14, reactCommand);
    client.reactCommands.set(reactCommand.name15, reactCommand);
}

let intervalActivity = null; // Starta a variável
function changeActivity() { // Função que muda o que o bot exibe no "Activity" a cada 20 segundos
    let activityId = 0
    if (intervalActivity !== null) { // Toda vez que a função for chamada (exceto a primeira) o interval vai ser parado
        clearInterval(intervalActivity)
    }
    intervalActivity = setInterval(() => { // É iniciado o interval
        switch (activityId) { // Para cada activityId é executado um setActivity() diferente e adicionado +1 no activityId
            case 0:
                client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffe" });
                activityId = 1;
                break;
            case 1:
                client.user.setActivity(`Temos ${client.users.cache.size} usuários`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffe" });
                activityId = 2;
                break;
            case 2:
                client.user.setActivity(`Estou a ${(((new Date()) - (Data.getTime())) / 60000).toFixed(0)}m ativo`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffe" });
                activityId = 3;
                break;
            case 3:
                const Hora = new Date
                client.user.setActivity(`Hora ${pad((Hora.getUTCHours() < 3) ? Hora.getUTCHours()+21 : Hora.getUTCHours()-3, 2)}:${pad(Hora.getUTCMinutes(), 2)}`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffe" });
                activityId = 0;
                break;
            default:
                client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`, { type: "STREAMING", url: "https://github.com/joaoscoelho/Coffe" });
                activityId = 0;
        }
    }, 20000); // 20000ms == 20s
};

function pad(number, width) { // Função para adicionar '0' à esquerda, para um número pequeno
    number += '' // Transforma o número em uma string
    return number.length >= width ? number : new Array(width - number.length + 1).join('0') + number; // Verifica se o tamanho do número é maior ou igual ao tamanho mínimo solicitado, caso seja, vai retornar o mesmo número, caso não seja, vai adicionar à esquerda do número os zeros que faltam
};

client.on("ready", () => { // Evento da largada do bot
    const nameServers = client.guilds.cache.map(server => server.name); // Mapeia todos os servers em que o bot está e retorna um array com seus nomes
    const qtdServers = nameServers.length; // Quantidade de nomes de server, igual a quantidade de servers
    const qtdUsers = client.users.cache.size; // Quantidade de usuários que o bot tem acesso
    const qtdChannels = client.channels.cache.size; // Quantidade de canais que o bot tem acesso
    const logChannel = client.channels.cache.get(config.logPrincipal); // Canal de logs do bot
    let lengthMax = ('' + qtdChannels).length; // Salva o maior tamanho entre a quantidade de usuários, servidores e canais
    if (('' + qtdServers).length > lengthMax) { lengthMax = ('' + qtdServers).length };
    if (('' + qtdUsers).length > lengthMax) { lengthMax = ('' + qtdUsers).length };
    if (lengthMax < 3) { lengthMax = 3 };
    
    function mostrarServersBlock() { // Função que mostra o nome de todos os servidores até que eles ocupem 900 caracteres de tamanho
        let result = ''
        let i = 0
        while (i <= qtdServers - 1) {
            if (result.length > 900) {
                result += `[...]`
                i = Infinity
            } else {
                result += `**${i + 1} - ${nameServers[i]}**\n`
                i++
            }
        }
        return result
    }

    // Log de largada do bot no console
    console.log(consoleColors[7] + "=========================== START ===========================" + consoleColors[0]);
    console.log(`População: ${consoleColors[6]}${pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais: ${consoleColors[6]}${pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores: ${consoleColors[6]}${pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}------------------------- SERVIDORES ------------------------${consoleColors[0]}`);
    for (let i = 0; i <= qtdServers - 1; i++) { // Pega o array de nome de servidores e vai logando o nome de todos eles
        console.log(`${i + 1} - ${consoleColors[5]}${nameServers[i]}${consoleColors[0]}`)
    };
    console.log(consoleColors[7] + "=============================================================" + consoleColors[0]);

    // Log de largada na sala de log do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.lime)
        .setTitle('<:power:745693968830038106> Start')
        .setAuthor(client.user.username, client.user.avatarURL())
        .addField('<:togglerightverde:747879943068713101> Status', `População: **${pad(qtdUsers, lengthMax)}**\nCanais: **${pad(qtdChannels, lengthMax)}**\nServidores: **${pad(qtdServers, lengthMax)}**`)
        .addField('<:serverblue:747879939734372392> Servidores', mostrarServersBlock())
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logChannel.send(logEmbed)
    changeActivity() // Chama a função de mudar o activity do bot
});

client.on("guildCreate", guild => { // Evento acionado quando o bot entra em um novo servidor
    const guildChannelCount = guild.channels.cache.size // Quantidade de canais do servidor
    const guildAdmins = guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.user.username).join(', ') // Filtra todos os membros que têm permissão de administrador dentro do server, e mapeia todos eles passando seus usernames separados por vírgula em forma de string
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.get(config.logPrincipal);
    let lengthMax = ('' + qtdChannels).length;
    if (('' + qtdServers).length > lengthMax) { lengthMax = ('' + qtdServers).length };
    if (('' + qtdUsers).length > lengthMax) { lengthMax = ('' + qtdUsers).length };
    if (lengthMax < 3) { lengthMax = 3 };

    // Log quando o bot entra em um novo servidor
    console.log(`${consoleColors[7]}=================== ENTROU EM UM NOVO SERVIDOR ===================${consoleColors[0]}`)
    console.log(`Nome do Servidor: ${consoleColors[5]}${guild.name}${consoleColors[0]}`);
    console.log(`Descrição: ${consoleColors[4]}${(guild.description == null) ? 'Sem descrição' : `"${guild.description}"`}${consoleColors[0]}`)
    console.log(`Id do Servidor: ${consoleColors[6]}${guild.id}${consoleColors[0]}`);
    console.log(`População do servidor: ${consoleColors[6]}${pad(guild.memberCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Quantidade de canais do Servidor: ${consoleColors[6]}${pad(guildChannelCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Ícone do Servidor: ${consoleColors[4]}${(guild.iconURL() == null) ? 'Sem ícone' : guild.iconURL()}${consoleColors[0]}`);
    console.log(`Dono do servidor: ${consoleColors[5]}${guild.owner.user.tag}${consoleColors[0]}  ID: ${consoleColors[6]}${guild.owner.id}${consoleColors[0]}`);
    console.log(`Admins: ${consoleColors[4]}${guildAdmins}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}----------------------------- STATUS -----------------------------${consoleColors[0]}`)
    console.log(`População: ${consoleColors[6]}${pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais: ${consoleColors[6]}${pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores: ${consoleColors[6]}${pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}==================================================================${consoleColors[0]}`)

    // Log na sala de logs do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.babyblue)
        .setTitle('<:loginblue:747879951511978095><:serverblue:747879939734372392> Entrei em um novo servidor')
        .setThumbnail(guild.iconURL({dynamic: true}))
        .addField('<:infoblue:747879943987265607> Informações', `Nome: **${guild.name}** \`${guild.id}\`\nDescrição: ${(guild.description == null) ? '**Sem descrição**' : `**"${guild.description}"**`}\nPopulação: **${pad(guild.memberCount, 2)}**\nCanais: **${pad(guildChannelCount, 2)}**\nOwner: **${guild.owner.user.tag}** \`${guild.ownerID}\`\nAdmins: **${guildAdmins}**`)
        .addField('<:togglerightverde:747879943068713101> Status', `População: **${pad(qtdUsers, lengthMax)}**\nCanais: **${pad(qtdChannels, lengthMax)}**\nServidores: **${pad(qtdServers, lengthMax)}**`)
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logChannel.send(logEmbed)
    changeActivity();
});

client.on("guildDelete", guild => { // Evento acionado quando o bot sai de algum servidor
    const guildAdmins = guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.displayName).join(', ')
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.get(config.logPrincipal);
    let lengthMax = ('' + qtdChannels).length;
    if (('' + qtdServers).length > lengthMax) { lengthMax = ('' + qtdServers).length };
    if (('' + qtdUsers).length > lengthMax) { lengthMax = ('' + qtdUsers).length };
    if (lengthMax < 3) { lengthMax = 3 };

    // Log quando o bot sai de um servidor
    console.log(`${consoleColors[7]}=================== SAIU DE UM SERVIDOR ===================${consoleColors[0]}`)
    console.log(`Nome do Servidor: ${consoleColors[5]}${guild.name}${consoleColors[0]}`);
    console.log(`Descrição: ${consoleColors[4]}${(guild.description == null) ? 'Sem descrição' : `"${guild.description}"`}${consoleColors[0]}`)
    console.log(`Id do Servidor: ${consoleColors[6]}${guild.id}${consoleColors[0]}`);
    console.log(`População do servidor: ${consoleColors[6]}${pad(guild.memberCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Ícone do Servidor: ${consoleColors[4]}${(guild.iconURL() == null) ? 'Sem ícone' : guild.iconURL()}${consoleColors[0]}`);
    console.log(`Dono do servidor: ${consoleColors[5]}${guild.owner.user.tag}${consoleColors[0]}  ID: ${consoleColors[6]}${guild.owner.id}${consoleColors[0]}`);
    console.log(`Admins: ${consoleColors[4]}${guildAdmins}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}----------------------------- STATUS -----------------------------${consoleColors[0]}`)
    console.log(`População: ${consoleColors[6]}${pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais: ${consoleColors[6]}${pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores: ${consoleColors[6]}${pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}==================================================================${consoleColors[0]}`)

    // Log na sala de logs do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.darkred)
        .setTitle('<:serverblue:747879939734372392><:logoutblue:747879951579086969> Saí de um servidor')
        .setThumbnail(guild.iconURL({dynamic: true}))
        .addField('<:infoblue:747879943987265607> Informações', `Nome: **${guild.name}** \`${guild.id}\`\nDescrição: ${(guild.description == null) ? '**Sem descrição**' : `**"${guild.description}"**`}\nPopulação: **${pad(guild.memberCount, 2)}**\nOwner: **${guildOwnerTag}** \`${guild.owner.id}\`\nAdmins: **${guildAdmins}**`)
        .addField('<:togglerightverde:747879943068713101> Status', `População: **${pad(qtdUsers, lengthMax)}**\nCanais: **${pad(qtdChannels, lengthMax)}**\nServidores: **${pad(qtdServers, lengthMax)}**`)
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logChannel.send(logEmbed)
    changeActivity();
});

client.on("message", async message => { // Evento acionado quando alguém manda alguma mensagem no chat
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // Um array com cada palavra digitada pelo usuário
    const comando = args.shift().toLowerCase(); // A primeira palavra do args minúscula
    const firstWord = message.content.trim().split(/ +/g).shift().toLowerCase(); // A primeira palavra da mensagem
    const logErrorChannel = client.channels.cache.get(config.logErro); // Canal para log dos erros
    if (message.author.bot) return; // Verifica se o autor é um bot, se for, retorna
    if (message.channel.type === 'dm') return; // Verifica se a mensagem foi enviada na dm, se for, retorna
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeCriarInvite = permissoesBot.has("CREATE_INSTANT_INVITE");
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES");
    if (firstWord === `<@${client.user.id}>`) { // Se a primeira palavra da mensagem for uma menção ao bot, ele responde
        if(podeEnviarMsg) { // Verifica se o bot pode mandar mensagem
            message.reply(`Alguém me chamou??🤗 Se estiver precisando de ajuda, use **${config.prefix}ajuda**`) 
        }
        return;
    }
    if (!isNaN(Number(message.content.slice(0, 1))) || message.content.startsWith('-')) {
        require('./commands/calculator.js').calc(message)
    }
    if (!message.content.startsWith(config.prefix)) return; // Se a mensagem não iniciar com o prefixo do bot, retorna
    if (!client.commands.has(comando)) { // Se o comando digitado pelo usuário não for compatível com nenhum comando do bot, ele responde
        if(podeEnviarMsg && podeManageMessages) { // Verifica se pode enviar mensagens e pode deleta-las
            const resp = await message.channel.send(`<:terminalblue:747879940749393951> Eu não conheço esse comando, use **${config.prefix}ajuda** para saber todos os meus comandos!`);
            resp.delete({timeout: 5000}) // Após 5 segundos desde o envio da mensagem acima, ele  a deleta
        }
        return;
    }  
    try { // Tenta executar o comando do usuário
        client.commands.get(comando).execute(message, args, comando, client);
    } catch (error) { // Caso não consiga executar o comando, loga o erro
        const errorEmbed = new Discord.MessageEmbed()
            .setColor(hex.orangered)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(`Erro ao executar comando ${comando}`)
            .setDescription(`<:alertcircleamarelo:747879938207514645> Houve um erro ao executar o comando **${comando}**!`)
            .addField(`<:serverblue:747879939734372392> Servidor`, `**${message.guild.name}** \`${message.guild.id}\``)
            .addField(`<:userblue:747880223214796941> Quem executou`, `**${message.author.tag}**\n\`${message.author.id}\``)
            .addField(`<:unlockblue:747879943077101579> Permissões`, `\`${message.member.permissions.toArray().join('`, `')}\``)
            .addField(`<:tagblue:747879941508694036> Dono do servidor`, `**${message.guild.owner.user.tag}** \`${message.guild.ownerID}\``)
            .addField(`<:xcirclered:747879954708037662> Erro`, error)
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setTimestamp()
            .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
        if (podeEnviarMsg) { // Verifica se pode enviar mensagens no canal
            await message.reply('<:alertcircleamarelo:747879938207514645> Houve um erro ao executar esse comando! A Equipe já foi informada!')
        } else if (podeAddReactions) { // Se não pode enviar mensagens, vai verificar se pode adicionar reações
            await message.react('alertcircleamarelo:747879938207514645')
        }
        console.log(error); // Loga o erro no console
        if (podeCriarInvite) { // Verifica se naquele canal pode criar um convite, caso possa, vai adicionar o link na url da embed
            await message.channel.createInvite({ maxAge: 0, reason: `Houve um erro ao executar um comando do bot ${client.user.tag} e os administradores precisam ser chamados para averiguar o problema` }).then(invite => {
                errorEmbed.setURL(`https://discord.gg/${invite.code}`)
            })
        }
        logErrorChannel.send(errorEmbed)
    }
});

client.on("messageReactionAdd", async (message, user) => { // Evento acionado quando algum usuário adiciona uma reação em uma mensagem
    const logErrorChannel = client.channels.cache.get(config.logErro);
    if (user.id === client.user.id) return; // Verifica se foi o bot quem adicionou a reação, se for, retorna
    if (user.bot) return; // Verifica se foi um bot quem adicionou a reação, se for, retona
    const errorEmbed = new Discord.MessageEmbed()
        .setColor(hex.orange)
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
    } else if(client.reactCommands.has(message.emoji.identifier)) { // Verifica se o bot tem algum comando que responda com o identifier do emoji
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
});

client.on("error", error => { // Evento acionado quando o bot se depara com algum erro
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const errorEmbed = new Discord.MessageEmbed()
        .setColor(hex.red)
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setTitle(`Aconteceu um erro!`)
        .addField(`<:xcirclered:747879954708037662> Erro`, error)
        .addField(`<:edit3blue:747879944369209344> Nome`, error.name)
        .addField(`<:paperblue:747879955895025664> Stack`, error.stack)
        .addField(`<:messagesquareblue:747879951461777448> Mensagem`, error.message)
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logErrorChannel.send(errorEmbed)
    console.log(error)
});

process.on("unhandledRejection", reason => { // Evento acionado quando o processo de execução se depara com um erro de rejeição
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const embedError = new Discord.MessageEmbed()
        .setColor(hex.yellow)
        .setTitle(`<:xcirclered:747879954708037662> Aconteceu um erro: **unhandledRejection**`)
        .setDescription(reason.stack)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL())
    logErrorChannel.send(embedError)
    console.error(reason)
})

process.on("uncaughtExceptionMonitor", (err, origin) => { // Evento acionado quando o processo de execução se depara com um erro fatal
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const embedError = new Discord.MessageEmbed()
        .setColor(hex.darkred)
        .setTitle(`<:xcirclered:747879954708037662> Aconteceu um erro: **uncaughtException**`)
        .setDescription(`${err} | ${origin}`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL())
    logErrorChannel.send(embedError)
    console.error(err, origin)
})

process.on("warning", warning => { // Evento acionado quanto o processo dispara um alerta
    const logErrorChannel = client.channels.cache.get(config.logErro);
    const embedError = new Discord.MessageEmbed()
        .setColor(hex.yellow)
        .setTitle(`<:alertcircleamarelo:747879938207514645> Aconteceu um aviso: **Warning**`)
        .setDescription(`${warning.name}\n\n${warning.message}\n\n${warning.stack}`)
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL())
    logErrorChannel.send(embedError)
    console.error(warning, warning.name, warning.message, warning.stack)
});

client.login(config.token) // Login do bot com o token