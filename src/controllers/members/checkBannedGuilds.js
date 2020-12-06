const client = require("../..");

module.exports = (members, ignore, obs, reject) => {
  if (Object.values(members).filter(member => Object.keys(client.db.cache.banned_guilds).includes(member.guild_id)).length) {
    if (ignore) {
      obs.ignoredValues = Object.values(members).map((member, index) => [Object.keys(members)[index], member])
        .filter(member => Object.keys(client.db.cache.banned_guilds).includes(member[1].guild_id));
      obs.ignoredValues.forEach(member => members[member[0]] = null);
    } else {
      reject(new Error('Um ou mais membros são de servidores que estão banidos!'));
      return false;
    };
  };
  return true;
};