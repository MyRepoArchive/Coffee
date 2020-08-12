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
    const logChannel = client.channels.cache.get(config.logPrincipal);
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
    const guildOwnerTag = client.users.cache.get(guild.ownerID).tag
    const guildAdmins = guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.displayName).join(', ')
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.get(config.logPrincipal);
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
    const guildOwnerTag = client.users.cache.get(guild.ownerID).tag
    const guildAdmins = guild.members.cache.filter(member => member.hasPermission("ADMINISTRATOR")).map(member => member.displayName).join(', ')
    const nameServers = client.guilds.cache.map(server => server.name);
    const qtdServers = nameServers.length;
    const qtdUsers = client.users.cache.size;
    const qtdChannels = client.channels.cache.size;
    const logChannel = client.channels.cache.get(config.logPrincipal);
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
    const comando = args.shift().toLowerCase();
    const firstWord = message.content.trim().split(/ +/g).shift().toLowerCase();
    const logErrorChannel = client.channels.cache.get(config.logErro);

    if(message.author.bot) return;
    if(message.channel.type === 'dm')return;
    if(firstWord === `<@${client.user.id}>`) {message.reply(`Alguém me chamou??🤗 Se estiver precisando de ajuda, use ${config.prefix}ajuda!`)}
    if(!message.content.startsWith(config.prefix))return;
    if(!client.commands.has(comando)) return;
    
    try {
        client.commands.get(comando).execute(message, args, comando, client);
    } catch (error) {
        const errorEmbed = new Discord.MessageEmbed()
            .setTitle(`Erro ao executar comando ${comando}`)
            .setDescription(`Houve um erro ao executar o comando **${comando}**, no servidor **${message.guild.name}**. Quem executou foi **${message.author.tag}** (**${message.member.permissions}**). O dono do servidor se chama **${message.guild.owner.user.tag}**`)
            .setColor(hex.orangered)
            .setTimestamp()
            .setFooter(`${client.user.tag} log sistem`)
        await message.reply('Houve um erro ao executar esse comando! A Equipe já foi informada!')
        await logErrorChannel.send(errorEmbed)
        console.log(error);
    }
});

// Evento acionado quando algum usuário adiciona uma reação em uma mensagem
client.on("messageReactionAdd", async react => {
    if(react.me === true && react.count > 1 && react.message.embeds[0].title === `Central de auto-atendimento ${client.user.username}`) {
        const commandList = {
            basic: {
                color: hex.lightblue,
                title: 'Comandos básicos',
                author: {
                    name: react.users.cache.find(user => user).username,
                    icon_url: react.users.cache.find(user => user).avatarURL(),
                },
                fields: [
                    {
                        name: `${config.prefix}ping`,
                        value: 'Responde com a latência do BOT e da API',
                    },
                    {
                        name: `${config.prefix}ajuda`,
                        value: 'Envia na DM da pessoa uma mensagem de ajuda',
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `Serviço de auto-atendimento ${client.user.username}`,
                    icon_url: client.user.avatarURL(),
                },
            },
            mod: {
                color: hex.lightblue,
                title: 'Comandos de moderação',
                author: {
                    name: react.users.cache.find(user => user).username,
                    icon_url: react.users.cache.find(user => user).avatarURL(),
                },
                timestamp: new Date(),
                footer: {
                    text: `Serviço de auto-atendimento ${client.user.username}`,
                    icon_url: client.user.avatarURL(),
                },
            },
            manager: {
                color: hex.lightblue,
                title: 'Comandos de gerenciamento do servidor',
                author: {
                    name: react.users.cache.find(user => user).username,
                    icon_url: react.users.cache.find(user => user).avatarURL(),
                },
                fields: [
                    {
                        name: `${config.prefix}criarCanal *nome* *tipo*`,
                        value: 'Cria um canal novo no servidor\n\nObs: *Deve ser colocado o nome do canal logo após o comando e o tipo do canal logo após o nome (**text** ou **voice**), caso não seja colocado um nome e um tipo, será criado um canal com nome padrão e tipo **text**.\n\n Caso queira manter o nome padrão e alterar o tipo, use **auto** (entre crases) no lugar do nome. Caso queira deixar o tipo padrão e alterar o nome, basta ignorar o tipo.*',
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `Serviço de auto-atendimento ${client.user.username}`,
                    icon_url: client.user.avatarURL(),
                },
            },
        };
        if(react.emoji.name === '1️⃣') {
            react.message.channel.send({ embed: commandList.basic });
        }
        if(react.emoji.name === '2️⃣') {
            react.message.channel.send({ embed: commandList.mod });
        }
        if(react.emoji.name === '3️⃣') {
            react.message.channel.send({ embed: commandList.manager });
        }
    }
});

client.login(config.token)