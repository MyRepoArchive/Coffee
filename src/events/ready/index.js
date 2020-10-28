const { reset, green, yellow } = require('../../utils/Console');
const { changeActivity } = require('../../functions');
const client = require('../..');
const log = require('./src/log');
const loadEmojis = require('./src/loadEmojis');
const validityController = require('../../controllers/validityController');

module.exports = () => {
  console.log(
    `${green}==================== START ====================${reset}\n` +
    `Usuários: ${yellow}${client.users.cache.size}${reset}. Servidores: ${yellow}${client.guilds.cache.size}${reset}. Canais: ${yellow}${client.channels.cache.size}${reset}\n`+
    `${green}===============================================${reset}`
  );

  loadEmojis();
  log();
  changeActivity();
  validityController();
}