const fs = require('fs');
const client = require('..');
const { reset, cyan, yellow } = require('../utils/Console');
const loadCommands = require('./loadCommands');

module.exports = () => {
  // Loop por todos os eventos da pasta eventos
  console.log(`${cyan}==================== LOADING EVENTS ====================${reset}`); 
  fs.readdirSync('./src/events', { withFileTypes: true }) // Lê a pasta "events"
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const event = require(`../events/${dirent.name}`);

      client.on(dirent.name, (...params) => event(...params)); // Registra o bot em todos os eventos da pasta "events"

      console.log(`Evento ${yellow}${dirent.name.toUpperCase()}${reset} carregado com sucesso!`);
    });
  console.log(`${cyan}========================================================${reset}`);

  loadCommands(); // Carrega os comandos do bot 
};