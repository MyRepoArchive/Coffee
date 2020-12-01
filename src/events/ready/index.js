const { reset, green, yellow } = require('../../utils/Console');
const client = require('../..');
const log = require('./src/log');
const loadEmojis = require('./src/loadEmojis');
const checkValidity = require('../../controllers/inventory/checkValidity');
const changeActivity = require('../../controllers/activities/changeActivity');

module.exports = () => {
  console.log(
    `${green}==================== START ====================${reset}\n` +
    `Iniciou em ${yellow}${parseInt(process.uptime() - (client.uptime / 1000))}${reset} segundos\n` +
    `Usuários: ${yellow}${client.users.cache.size}${reset}. Servidores: ${yellow}${client.guilds.cache.size}${reset}. Canais: ${yellow}${client.channels.cache.size}${reset}\n`+
    `${green}===============================================${reset}`
  );

  loadEmojis();
  log();
  changeActivity();
  checkValidity();
};