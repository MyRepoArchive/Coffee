const client = require("../..");

module.exports = (members, ignore, obs, reject) => {
  if (Object.values(members).filter(member => Object.keys(client.db.cache.banned_users).includes(member.user_id)).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(members).map((member, index) => [Object.keys(members)[index], member])
        .filter(member => Object.keys(client.db.cache.banned_users).includes(member[1].user_id)));
      obs.ignoredValues.forEach(member => members[member[0]] = null);
    } else {
      reject(new Error('Um ou mais membros estão banidos!'));
      return false;
    };
  };
  return true;
};