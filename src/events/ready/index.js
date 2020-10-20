const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json')
const pad = require('../utils/pad.js')
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
const changeActivity = require('../utils/changeActivity.js')
const fs = require('fs')

module.exports = {
  name: "ready",

  async execute(client, intervalActivity, Data) {
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
    console.log(`População: ${consoleColors[6]}${pad.pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais: ${consoleColors[6]}${pad.pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores: ${consoleColors[6]}${pad.pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}------------------------- SERVIDORES ------------------------${consoleColors[0]}`);
    for (let i = 0; i <= qtdServers - 1; i++) { // Pega o array de nome de servidores e vai logando o nome de todos eles
        console.log(`${i + 1} - ${consoleColors[5]}${nameServers[i]}${consoleColors[0]}`)
    };
    console.log(consoleColors[7] + "=============================================================" + consoleColors[0]);

    // Log de largada na sala de log do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.lightstategray)
        .setTitle('<:power:745693968830038106> Start')
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .addField('<:togglerightverde:747879943068713101> Status', `População: **${pad.pad(qtdUsers, lengthMax)}**\nCanais: **${pad.pad(qtdChannels, lengthMax)}**\nServidores: **${pad.pad(qtdServers, lengthMax)}**`)
        .addField('<:serverblue:747879939734372392> Servidores', mostrarServersBlock())
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logChannel.send(logEmbed)
    changeActivity.run(intervalActivity, client, Data) // Chama a função de mudar o activity do bot
    const nameEmojis = client.emojis.cache.map(emoji => emoji.name)
    const arrayEmojis = client.emojis.cache.map(emoji => emoji.identifier)
    let json = ''
    for(let i = 0; i < nameEmojis.length; i++) {
        if(i !== nameEmojis.length-1) {
            json += `  "${nameEmojis[i]}": "${arrayEmojis[i]}",\n`
        } else {
            json += `  "${nameEmojis[i]}": "${arrayEmojis[i]}"`
        }
    }
    fs.writeFile('./emojis.json', `{\n${json}\n}`, err => {
        if(err) throw err
    })
  }
}