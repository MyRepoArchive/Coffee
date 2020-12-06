const client = require("../..");

module.exports = (prefixes, ignore, obs, reject) => {
  if (Object.values(prefixes).filter(value => typeof value !== "string" || value === '').length) {
    if (ignore) {
      obs.ignoredValues = Object.values(prefixes).map((prefix, index) => [Object.keys(prefixes)[index], prefix])
        .filter(value => typeof value[1] !== "string" || value[1] === '');

      Object.keys(prefixes).forEach(key => {
        if (Object.values(prefixes).filter(value => typeof value !== "string" || value === '').includes(prefixes[key])) 
          prefixes[key] = client.db.cache.prefixes[key] || null;
      });
    } else {
      reject(new Error('O valor deve ser uma string!'));
      return false;
    };
  };
  return true;
};