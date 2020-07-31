const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const Data = new Date

const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
//CORES PÁRA COLORIR TERMINAL
/*
0 = reset
1 = black
2 = red
3 = green
4 = yellow
5 = blue
6 = magenta
7 = cyan
8 = white
*/

client.on("ready", () => {
    const nameServers = client.guilds.cache.map(server => server.name)
    const qtdServers = nameServers.length

    console.log(consoleColors[7]+"=========================== START ==========================="+consoleColors[0]);
    console.log(`${consoleColors[3]}-PRONTO!-${consoleColors[0]}`)
    console.log(`População:       ${consoleColors[6]}${client.users.cache.size}${consoleColors[0]}`);
    console.log(`Canais:          ${consoleColors[6]}${client.channels.cache.size}${consoleColors[0]}`);
    console.log(`Servidores:      ${consoleColors[6]}${client.guilds.cache.size}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}------------------------- SERVIDORES ------------------------${consoleColors[0]}`);
    for(var i = 0; i <= qtdServers-1; i++) {
        console.log(`${i+1} - ${consoleColors[5]}${nameServers[i]}${consoleColors[0]}`)
    };
    console.log(consoleColors[7]+"============================================================="+consoleColors[0]);


    setInterval(() => {
        var activityId = 0
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
                client.user.setActivity(`Use **!help** para obter ajuda!`);
                activityId = 3;
                break;
            case 3:
                client.user.setActivity(`Hora ${Data.getHours}:${Data.getMinutes}`);
                activityId = 0;
                break;
            default:
                client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);
                activityId = 0;
        }
    }, 3000);
});

client.on("guildCreate", guild => {
    console.log(`O bot entrou no servidor ${guild.name}, de ID ${guild.id}. População: ${guild.memberCount} membros`);
    client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);

});

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} ${guild.id}`);
    client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`);
});

client.on("message", async message => {
    if(message.author.bot || message.channel.type == "dm") return;
    console.log(message.channel.guild.systemChannel.name)
    message.channel.send('Olá, mundo!')
});

client.login(config.token)