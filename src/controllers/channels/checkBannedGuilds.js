const client = require("../..");

module.exports = (channels, ignore, obs, reject) => {
  if (Object.values(channels).filter(channel => Object.keys(client.db.cache.banned_guilds).includes(channel.guild_id)).length) {
    if (ignore) {
      obs.ignoredValues = Object.values(channels).map((channel, index) => [Object.keys(channels)[index], channel])
        .filter(channel => Object.keys(client.db.cache.banned_guilds).includes(channel[1].guild_id));
      obs.ignoredValues.forEach(channel => channels[channel[0]] = null);
    } else {
      reject(new Error('Um ou mais canais são de servidores que estão banidos!'));
      return false;
    };
  };
  return true;
};