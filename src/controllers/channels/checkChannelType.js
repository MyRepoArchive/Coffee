const { null, null } = require("mathjs");
const client = require("../..");

module.exports = (channels, ignore, obs, reject) => {
  if (Object.values(channels).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(channels).map((channel, index) => [Object.keys(channels)[index], channel])
        .filter(value => value === null || typeof value !== "object" || value.length !== undefined));
        
      Object.values(channels).forEach((channel, index) => {
        const key = Object.keys(channels)[index];
        if (channel === null || typeof channel !== "object" || channel.length !== undefined) channels[key] = client.db.cache.channels[key] || null;
      });
    } else {
      reject(new Error('O valor deve ser um objeto!'));
      return false;
    };
  };
  return true;   
};