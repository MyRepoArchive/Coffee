const log = require('./src/log');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkExistence = require('../../controllers/guilds/checkExistence');

module.exports = (guild) => {
  const { error } = require('../../functions');

  log(guild);

  checkExistence([guild.id]);
};