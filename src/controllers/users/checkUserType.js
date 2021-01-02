const client = require("../..");

module.exports = (users, ignore, obs, reject) => {
  if (Object.values(users).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.entries(users)
        .filter(value => value === null || typeof value !== "object" || value.length !== undefined));
        
      Object.values(users).forEach((user, index) => {
        const key = Object.keys(users)[index];
        if (user === null || typeof user !== "object" || user.length !== undefined) users[key] = client.db.cache.users[key] || null;
      });
    } else {
      reject(new Error('O valor deve ser um objeto!'));
      return false;
    };
  };
  return true;   
};