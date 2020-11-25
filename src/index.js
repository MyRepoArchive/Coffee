const Discord = require('discord.js'); // Requerimento da biblioteca Discord.js
const { token } = require('./config/auth.json'); // TOKEN para logar o bot
const client = new Discord.Client(); // Instância do Client

client.login(token).then(() => { // Authentica o bot na API do Discord
  const { handlerLoader } = require('./functions');
  handlerLoader(); // Carrega os eventos e comandos

  require('./services/botApi'); // Inicia a api local
});

module.exports = client; // Exporta o client (bot)