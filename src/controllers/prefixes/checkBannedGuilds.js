const client = require("../..");

module.exports = (prefixes, ignore, obs, reject) => {
  if (Object.keys(prefixes).filter(key => Object.keys(client.db.cache.banned_guilds).includes(key)).length) {
    if (ignore) {
      obs.ignoredKeys = Object.keys(prefixes).filter(key => Object.keys(client.db.cache.banned_guilds).includes(key));
      obs.ignoredKeys.forEach((guild_id) => prefixes[guild_id] = 0);
    } else {
      reject(new Error('Um ou mais servidores estão na lista de banidos!'));
      return false;
    };
  };
  return true;
};