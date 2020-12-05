const log = require('./src/log');
const checkExistence = require('../../controllers/guilds/checkExistence');

module.exports = (guild) => {
  log(guild);

  checkExistence([guild.id]);
};