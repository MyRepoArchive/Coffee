const Discord = require('discord.js'); // Requerimento da biblioteca Discord.js
const { token } = require('./config/auth.json'); // TOKEN para logar o bot
const client = new Discord.Client(); // Instância do Client

require('./server').start().then(() => client.login(token).then(() => { // Authentica o bot na API do Discord
  const { handlerLoader } = require('./functions');
  handlerLoader(); // Carrega os eventos e comandos
}));

module.exports = client; // Exporta o client (bot)