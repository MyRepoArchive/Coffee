const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./info.json");
const hex = require('./colors.json');
const Data = new Date;
// CORES PARA COLORIR TERMINAL
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
// 0 = reset; 1 = black; 2 = red; 3 = green; 4 = yellow; 5 = roxo; 6 = magenta; 7 = cyan; 8 = white;
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
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

// Função que muda o que o bot exibe no "Activity" a cada 30 segundos
let intervalActivity = null;
function changeActivity() {
    let activityId = 0
    if(intervalActivity !== null) {
        clearInterval(intervalActivity)
    }
    intervalActivity = setInterval(() => {  
        switch (activityId) {
            case 0:
                client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);
                activityId = 1;
                break;
            case 1:
                client.user.setActivity(`Temos ${client.users.cache.size} usuários`);
                activityId = 2;
                break;
            case 2:
                client.user.setActivity(`Estou a ${(((new Date()) - (Data.getTime()))/60000).toFixed(0)}m ativo`);
                activityId = 3;
                break;
            case 3:
                const Hora = new Date
                client.user.setActivity(`Hora ${Hora.getHours()}:${Hora.getMinutes()}`);
                activityId = 0;
                break;
            default:
                client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);
                activityId = 0;
        }
    }, 30000);
};
// Função para adicionar '0' à esquerda, para um número pequeno
function pad(number, width) {
    number += ''
    return number.length >= width ? number : new Array(width - number.length + 1).join('0') + number;
};


// Evento da largada do bot
client.on("ready", () => {
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.filter(canais => canais.id == config.logPrincipal).find(log => log);
    let lengthMax = (''+qtdChannels).length;
    
    
    if((''+qtdServers).length > lengthMax) {lengthMax = (''+qtdServers).length};
    if((''+qtdUsers).length > lengthMax) {lengthMax = (''+qtdUsers).length};
    if(lengthMax < 3) {lengthMax = 3};


    // Função que mostra o nome de todos os servidores até que eles ocupem 900 caracteres de tamanho
    function mostrarServersBlock() {
        let result = ''
        let i = 0
        while(i <= qtdServers-1) {
            if(result.length > 900) {
                result += `[...]`
                i = Infinity
            } else {
                result += `**${i+1} - ${nameServers[i]}**\n`
                i++
            }
        }
        
        return result
    }
    

    // Log de largada do bot no console
    console.log(consoleColors[7]+"=========================== START ==========================="+consoleColors[0]);
    console.log(`${consoleColors[3]}-PRONTO!-${consoleColors[0]}`)
    console.log(`População:       ${consoleColors[6]}${pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais:          ${consoleColors[6]}${pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores:      ${consoleColors[6]}${pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}------------------------- SERVIDORES ------------------------${consoleColors[0]}`);
    for(let i = 0; i <= qtdServers-1; i++) {
        console.log(`${i+1} - ${consoleColors[5]}${nameServers[i]}${consoleColors[0]}`)
    };
    console.log(consoleColors[7]+"============================================================="+consoleColors[0]);


    // Log de largada na sala de log do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.lime)
        .setTitle('-------------------- START --------------------')
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription('-PRONTO!-')
        .addField('------------ STATUS ------------', `População:     **${pad(qtdUsers, lengthMax)}**\nCanais:             **${pad(qtdChannels, lengthMax)}**\nServidores:     **${pad(qtdServers, lengthMax)}**`)
        .addField('------------ SERVIDORES ------------', mostrarServersBlock())  
        .setTimestamp()
        .setFooter(client.user.tag)
    logChannel.send(logEmbed)
    changeActivity()
});


// Evento acionado quando o bot entra em um novo servidor
client.on("guildCreate", guild => {
    const guildName = guild.name
    const guildDescription = guild.description
    const guildId = guild.id
    const guildMemberCount = guild.memberCount
    const guildChannelCount = guild.channels.cache.size
    const guildOwnerTag = client.users.cache.filter(user => user.id == guild.owner.id).map(dono => dono.tag)
    const guildAdmins = guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.displayName).join(', ')
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.filter(canais => canais.id == config.logPrincipal).find(log => log);
    let lengthMax = (''+qtdChannels).length;
    
    
    if((''+qtdServers).length > lengthMax) {lengthMax = (''+qtdServers).length};
    if((''+qtdUsers).length > lengthMax) {lengthMax = (''+qtdUsers).length};
    if(lengthMax < 3) {lengthMax = 3};

    
    // Log quando o bot entra em um novo servidor
    console.log(`${consoleColors[7]}=================== ENTROU EM UM NOVO SERVIDOR ===================${consoleColors[0]}`)
    console.log(`Nome do Servidor:                   ${consoleColors[5]}${guildName}${consoleColors[0]}`);
    console.log(`Descrição:                          ${consoleColors[4]}${(guildDescription == null) ? 'Sem descrição' : `"${guildDescription}"`}${consoleColors[0]}`)
    console.log(`Id do Servidor:                     ${consoleColors[6]}${guildId}${consoleColors[0]}`);
    console.log(`População do servidor:              ${consoleColors[6]}${pad(guildMemberCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Quantidade de canais do Servidor:   ${consoleColors[6]}${pad(guildChannelCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Ícone do Servidor:                  ${consoleColors[4]}${(guild.iconURL() == null) ? 'Sem ícone' : guild.iconURL()}${consoleColors[0]}`);
    console.log(`Dono do servidor:                   ${consoleColors[5]}${guildOwnerTag}${consoleColors[0]}  ID: ${consoleColors[6]}${guild.owner.id}${consoleColors[0]}`);
    console.log(`Admins:                             ${consoleColors[4]}${guildAdmins}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}----------------------------- STATUS -----------------------------${consoleColors[0]}`)
    console.log(`População:       ${consoleColors[6]}${pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais:          ${consoleColors[6]}${pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores:      ${consoleColors[6]}${pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}==================================================================${consoleColors[0]}`)


    // Log na sala de logs do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.babyblue)
        .setTitle('-------------------- NOVO SERVIDOR --------------------')
        .setThumbnail(guild.iconURL())
        .addField('------------ SERVIDOR ------------', `Nome do Servidor: **${guildName}**\nDescrição: ${(guildDescription == null) ? '**Sem descrição**' : `**"${guildDescription}"**`}\nID do Servidor: **${guildId}**\nPopulação do Servidor: **${pad(guildMemberCount, lengthMax)}**\nCanais do Servidor: **${pad(guildChannelCount, lengthMax)}**\nDono do Servidor: **${guildOwnerTag}**\nID do Owner: **${guild.owner.id}**\nAdmins: **${guildAdmins}**`)
        .addField('------------- STATUS -------------', `População:     **${pad(qtdUsers, lengthMax)}**\nCanais:             **${pad(qtdChannels, lengthMax)}**\nServidores:     **${pad(qtdServers, lengthMax)}**`)  
        .setTimestamp()
        .setFooter(client.user.tag)
    logChannel.send(logEmbed)

    
    changeActivity();

});


// Evento acionado quando o bot sai de algum servidor
client.on("guildDelete", guild => {
    const guildName = guild.name
    const guildDescription = guild.description
    const guildId = guild.id
    const guildMemberCount = guild.memberCount
    const guildChannelCount = guild.channels.cache.size
    const guildOwnerTag = client.users.cache.filter(user => user.id == guild.owner.id).map(dono => dono.tag)
    const guildAdmins = guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.displayName).join(', ')
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.filter(canais => canais.id == config.logPrincipal).find(log => log);
    let lengthMax = (''+qtdChannels).length;
    
    
    if((''+qtdServers).length > lengthMax) {lengthMax = (''+qtdServers).length};
    if((''+qtdUsers).length > lengthMax) {lengthMax = (''+qtdUsers).length};
    if(lengthMax < 3) {lengthMax = 3};

    
    // Log quando o bot sai de um servidor
    console.log(`${consoleColors[7]}=================== SAIU DE UM SERVIDOR ===================${consoleColors[0]}`)
    console.log(`Nome do Servidor:                   ${consoleColors[5]}${guildName}${consoleColors[0]}`);
    console.log(`Descrição:                          ${consoleColors[4]}${(guildDescription == null) ? 'Sem descrição' : `"${guildDescription}"`}${consoleColors[0]}`)
    console.log(`Id do Servidor:                     ${consoleColors[6]}${guildId}${consoleColors[0]}`);
    console.log(`População do servidor:              ${consoleColors[6]}${pad(guildMemberCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Ícone do Servidor:                  ${consoleColors[4]}${(guild.iconURL() == null) ? 'Sem ícone' : guild.iconURL()}${consoleColors[0]}`);
    console.log(`Dono do servidor:                   ${consoleColors[5]}${guildOwnerTag}${consoleColors[0]}  ID: ${consoleColors[6]}${guild.owner.id}${consoleColors[0]}`);
    console.log(`Admins:                             ${consoleColors[4]}${guildAdmins}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}----------------------------- STATUS -----------------------------${consoleColors[0]}`)
    console.log(`População:       ${consoleColors[6]}${pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais:          ${consoleColors[6]}${pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores:      ${consoleColors[6]}${pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}==================================================================${consoleColors[0]}`)


    // Log na sala de logs do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.darkred)
        .setTitle('-------------------- SAIU DE UM SERVIDOR --------------------')
        .setThumbnail(guild.iconURL())
        .addField('------------ SERVIDOR ------------', `Nome do Servidor: **${guildName}**\nDescrição: ${(guildDescription == null) ? '**Sem descrição**' : `**"${guildDescription}"**`}\nID do Servidor: **${guildId}**\nPopulação do Servidor: **${pad(guildMemberCount, lengthMax)}**\nDono do Servidor: **${guildOwnerTag}**\nID do Owner: **${guild.owner.id}**\nAdmins: **${guildAdmins}**`)
        .addField('------------- STATUS -------------', `População:     **${pad(qtdUsers, lengthMax)}**\nCanais:             **${pad(qtdChannels, lengthMax)}**\nServidores:     **${pad(qtdServers, lengthMax)}**`)  
        .setTimestamp()
        .setFooter(client.user.tag)
    logChannel.send(logEmbed)

    
    changeActivity();

});


// Evento acionado quando alguém manda alguma mensagem no chat
client.on("message", async message => { 
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase()
    const firstWord = message.content.trim().split(/ +/g).shift().toLowerCase()
    const logChannel = client.channels.cache.filter(canais => canais.id == config.logPrincipal).find(log => log);
    const logErrorChannel = client.channels.cache.filter(canais => canais.id == config.logErro).find(log => log);
    
    if(message.author.bot) return;

    // Comandos por DM
    if(message.channel.type === 'dm') {
        const penultMsg = message.channel.messages.cache.map(message => message)[message.channel.messages.cache.size-2]
        const anteAntePenultMsg = message.channel.messages.cache.map(message => message)[message.channel.messages.cache.size-4]
        if(penultMsg === undefined)return;
        if(penultMsg.content === 'helpEmbed' || anteAntePenultMsg.content === 'helpEmbed') {
            switch (firstWord) {
                case '1':
                case '[1]':
                    message.channel.send(`Aqui está a lista dos comandos básicos!`);
                    break;
                case '2':
                case '[2]':
                    message.channel.send(`Aqui está a lista dos comandos de moderação!`);
                    break;
                default: 
                    message.channel.send(`Opção inválida, use uma das opções mencionadas na embed!`);
            }
        }
    } 
    
    if(message.channel.type === 'dm')return;

    // Comandos que não precisam começar com o prefixo
    if(firstWord == `<@${client.user.id}>` || firstWord === '!ajuda') {
        const helpEmbed = new Discord.MessageEmbed() 
            .setColor(hex.white)
            .setURL('https://github.com/joaoscoelho/Coffe')
            .setAuthor(message.author.tag, (message.author.avatarURL() === null) ? '' : message.author.avatarURL())
            .setTitle(`Central de auto-atendimento **${client.user.username}**`)
            .setDescription(`Como posso ajuda Sr(a) ${message.author.username}?`)
            .addFields(
                {name: `[1] - Comandos Básicos`, value: `Lista de todos os comandos considerados básicos`},
                {name: `[2] - Comandos de moderação`, value: `Lista de todos os comandos usados para moderação`}
            )
            .setTimestamp()
            .setFooter(client.user.tag)

        const msg = await message.author.send(helpEmbed);
        msg.react('🔄')
        msg.content = 'helpEmbed'
    }

    // Todos os comandos que começam com o prefixo
    if(!message.content.startsWith(config.prefix))return;
    message.guild.channels.create('nome', {})

    if(!client.commands.has(comando)) return;
    try {
        client.commands.get(comando).execute(message, args, comando);
    } catch (error) {
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Erro ao executar comando ${comando}`)
            .setDescription(`Houve um erro ao executar o comando **${comando}**, no servidor **${message.guild.name}**. Quem executou foi **${message.author.tag}** (**${message.member.permissions}**). O dono do servidor se chama **${message.guild.owner.user.tag}**`)
            .setColor(hex.orangered)
            .setTimestamp()
            .setFooter(`${client.user.tag} log sistem`)
        console.log(error);
        message.reply('Houve um erro ao executar esse comando! A Equipe já foi informada!')
        logErrorChannel.send(errorEmbed)
    }
});


// Evento acionado quando algum usuário adiciona uma reação em uma mensagem
client.on("messageReactionAdd", async react => {
    if(react.me === true && react.count > 1 && react.message.content === 'helpEmbed') {

        const author = react.users.cache.find(user => user.id !== client.user.id)
        const helpEmbed = new Discord.MessageEmbed() 
        .setColor(hex.white)
        .setURL('https://github.com/joaoscoelho/Coffe')
        .setAuthor(author.tag, (author.avatarURL() === null) ? '' : author.avatarURL())
        .setTitle(`Central de auto-atendimento **${client.user.username}**`)
        .setDescription(`Como posso ajuda Sr(a) ${author.username}?`)
        .addFields(
            {name: `[1] - Comandos Básicos`, value: `Lista de todos os comandos considerados básicos`},
            {name: `[2] - Comandos de moderação`, value: `Lista de todos os comandos usados para moderação`}
        )
        .setTimestamp()
        .setFooter(client.user.tag)


        const msg = await react.message.channel.send(helpEmbed)
        msg.react('🔄')
        msg.content = 'helpEmbed'
    }
});


// Evento não documentado
client.on("raw", async raw => {});


client.login(config.token)