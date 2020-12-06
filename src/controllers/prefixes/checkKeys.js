const client = require("../..");

module.exports = (prefixes, ignore, obs, reject) => {
  if (Object.keys(prefixes).filter(key => /\D+/g.test(key + '')).length) {
    if (ignore) {
      obs.ignoredKeys.push(Object.keys(prefixes).filter(key => /\D+/g.test(key + '')));
      obs.ignoredKeys = [...new Set(obs.ignoredKeys)];
      obs.ignoredKeys.forEach((guild_id) => prefixes[guild_id] = 0);
    } else {
      reject(new Error('A key da propriedade não pode corresponder à seguinte expressão: "/\\D+/g"'));
      return false;
    };
  };
  return true;
};