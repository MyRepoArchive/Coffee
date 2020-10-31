const fs = require('fs');
const client = require('../..');
const { reset, yellow, cyan } = require('../../utils/Console');

module.exports = () => {
  const { loadCommands } = require('..');

  // Loop por todos os eventos da pasta eventos
  console.log(`${yellow}==================== LOADING EVENTS ====================${reset}`);
  fs.readdirSync('./src/events', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
      const event = require(`../../events/${dirent.name}`);

      client.on(dirent.name, (...params) => event(...params));

      console.log(`Evento ${cyan}${dirent.name.toUpperCase()}${reset} carregado com sucesso!`);
    });
  console.log(`${yellow}========================================================${reset}`);

  require('../../controllers/botAuthController')()
    .then(() => loadCommands(true), () => loadCommands());
};