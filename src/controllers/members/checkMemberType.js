const client = require("../..");

module.exports = (members, ignore, obs, reject) => {
  if (Object.values(members).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(members).map((member, index) => [Object.keys(members)[index], member])
        .filter(value => value === null || typeof value !== "object" || value.length !== undefined));
        
      Object.values(members).forEach((member, index) => {
        const key = Object.keys(members)[index];
        if (member === null || typeof member !== "object" || member.length !== undefined) members[key] = client.db.cache.members[key] || null;
      });
    } else {
      reject(new Error('O valor deve ser um objeto!'));
      return false;
    };
  };
  return true;   
};