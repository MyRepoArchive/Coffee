const Discord = require('discord.js'); // Requerimento da biblioteca Discord.js
const { token } = require('./config/auth.json'); // TOKEN para logar o bot
const client = new Discord.Client(); // Instância do Client

client.login(token); // Login do client com token

const { handlerLoader } = require('./functions');

client.on("ready", () => { 
  client.events.get('ready').execute(client, intervalActivity, Data);
  require('./controllers/validityController')(); 
  handlerLoader(); 
}); // Evento da largada do bot 

client.on("guildCreate", guild => { client.events.get('guildCreate').execute(client, guild, intervalActivity, Data, mysqlDb) }); 

client.on("guildDelete", guild => { client.events.get('guildDelete').execute(client, guild, intervalActivity, Data, mysqlDb); });

client.on("message", async message => { client.events.get('message').execute(client, message, mysqlDb) });

client.on("guildMemberAdd", async member => { client.events.get('guildMemberAdd').execute(client, member, mysqlDb); })

client.on("messageReactionAdd", async (message, user) => { client.events.get('messageReactionAdd').execute(client, message, user, mysqlDb) });

client.on("error", error => { client.events.get('error').execute(client) });

process.on("unhandledRejection", reason => { require('./utils/processEvents.js').ur(reason, client) });

process.on("warning", warning => { require('./utils/processEvents.js').wa(warning, client) });

module.exports = client;