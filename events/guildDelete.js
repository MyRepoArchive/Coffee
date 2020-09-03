const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json')
const pad = require('../utils/pad.js')
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
const changeActivity = require('../utils/changeActivity.js')

module.exports = {
  name: "guildDelete",

  async execute(client, guild, intervalActivity, Data, connection) {
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
    console.log(`População do servidor: ${consoleColors[6]}${pad.pad(guild.memberCount, lengthMax)}${consoleColors[0]}`)
    console.log(`Ícone do Servidor: ${consoleColors[4]}${(guild.iconURL() == null) ? 'Sem ícone' : guild.iconURL()}${consoleColors[0]}`);
    console.log(`Dono do servidor: ${consoleColors[5]}${guild.owner.user.tag}${consoleColors[0]}  ID: ${consoleColors[6]}${guild.owner.id}${consoleColors[0]}`);
    console.log(`Admins: ${consoleColors[4]}${guildAdmins}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}----------------------------- STATUS -----------------------------${consoleColors[0]}`)
    console.log(`População: ${consoleColors[6]}${pad.pad(qtdUsers, lengthMax)}${consoleColors[0]}`);
    console.log(`Canais: ${consoleColors[6]}${pad.pad(qtdChannels, lengthMax)}${consoleColors[0]}`);
    console.log(`Servidores: ${consoleColors[6]}${pad.pad(qtdServers, lengthMax)}${consoleColors[0]}`)
    console.log(`${consoleColors[7]}==================================================================${consoleColors[0]}`)

    // Log na sala de logs do bot
    const logEmbed = new Discord.MessageEmbed()
        .setColor(hex.gray21)
        .setTitle('<:serverblue:747879939734372392><:logoutblue:747879951579086969> Saí de um servidor')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addField('<:infoblue:747879943987265607> Informações', `Nome: **${guild.name}** \`${guild.id}\`\nDescrição: ${(guild.description == null) ? '**Sem descrição**' : `**"${guild.description}"**`}\nPopulação: **${pad.pad(guild.memberCount, 2)}**\nOwner: **${guildOwnerTag}** \`${guild.owner.id}\`\nAdmins: **${guildAdmins}**`)
        .addField('<:togglerightverde:747879943068713101> Status', `População: **${pad.pad(qtdUsers, lengthMax)}**\nCanais: **${pad.pad(qtdChannels, lengthMax)}**\nServidores: **${pad.pad(qtdServers, lengthMax)}**`)
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
    logChannel.send(logEmbed)
    changeActivity.run(intervalActivity, client, Data);
  }
}