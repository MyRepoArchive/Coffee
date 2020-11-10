const Discord = require('discord.js'); // Requerimento da biblioteca Discord.js
const { token } = require('./config/auth.json'); // TOKEN para logar o bot
const client = new Discord.Client(); // Instância do Client
const fs = require('fs');

fs.writeFileSync('./src/utils/log.txt', '');

client.login(token).then(() => {
  const { handlerLoader } = require('./functions');
  handlerLoader();
});

module.exports = client;