const Discord = require('discord.js'); // Requerimento da biblioteca Discord.js
const { token } = require('./config/auth.json'); // TOKEN para logar o bot
const { client } = require('./functions'); // Client instanciado

require('./controllers/validityController')(); // Passar isso para dentro Ready!


require('./utils/setHandlerNames.js').run(client) // Executa o arquivo com a função de setar os nomes nos events, commands e reactCommands

client.on("ready", () => { client.events.get('ready').execute(client, intervalActivity, Data) }); // Evento da largada do bot 

client.on("guildCreate", guild => { client.events.get('guildCreate').execute(client, guild, intervalActivity, Data, mysqlDb) }); // Evento acionado quando o bot entra em um novo servidor

client.on("guildDelete", guild => { client.events.get('guildDelete').execute(client, guild, intervalActivity, Data, mysqlDb); }); // Evento acionado quando o bot sai de algum servidor

client.on("message", async message => { client.events.get('message').execute(client, message, mysqlDb) }); // Evento acionado quando alguém manda alguma mensagem no chat

client.on("guildMemberAdd", async member => { client.events.get('guildMemberAdd').execute(client, member, mysqlDb); })

client.on("messageReactionAdd", async (message, user) => { client.events.get('messageReactionAdd').execute(client, message, user, mysqlDb) }); // Evento acionado quando algum usuário adiciona uma reação em uma mensagem

client.on("error", error => { client.events.get('error').execute(client) }); // Evento acionado quando o bot se depara com algum erro

process.on("unhandledRejection", reason => { require('./utils/processEvents.js').ur(reason, client) }); // Evento acionado quando o processo de execução se depara com um erro de rejeição

process.on("warning", warning => { require('./utils/processEvents.js').wa(warning, client) }); // Evento acionado quanto o processo dispara um alerta

/* client.login(token); // Login do bot com o token */