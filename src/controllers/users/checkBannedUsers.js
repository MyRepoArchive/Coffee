const client = require("../..");

module.exports = (users, ignore, obs, reject) => {
  if (Object.values(users).filter(user => Object.keys(client.db.cache.banned_users).includes(user.id)).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.entries(users)
        .filter(user => Object.keys(client.db.cache.banned_users).includes(user[1].id)));
      obs.ignoredValues.forEach(user => users[user[0]] = null);
    } else {
      reject(new Error('Um ou mais usuários estão banidos!'));
      return false;
    };
  };
  return true;
};