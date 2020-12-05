const fs = require('fs');
const client = require('..');
const { reset, cyan, yellow } = require('../utils/Console');
const loadCommands = require('./loadCommands');

module.exports = () => {
  const dirents = fs.readdirSync('./src/events', { withFileTypes: true }).filter(dirent => dirent.isDirectory());

  // Loop por todos os eventos da pasta eventos
  console.log(`${cyan}==================== LOADING EVENTS (${reset}${dirents.length}${cyan}) ====================${reset}`);
  dirents.forEach(dirent => {
    const event = require(`../events/${dirent.name}`);

    client.on(dirent.name, (...params) => event(...params)); // Registra o bot em todos os eventos da pasta "events"

    console.log(`Evento ${yellow}${dirent.name.toUpperCase()}${reset} carregado com sucesso!`);
  });
  console.log(`${cyan}========================================================${reset}`);

  loadCommands(); // Carrega os comandos do bot 
};