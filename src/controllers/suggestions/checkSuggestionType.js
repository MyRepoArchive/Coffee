const client = require("../..");

module.exports = (suggestions, ignore, obs, reject) => {
  if (Object.values(suggestions).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(suggestions).map((suggestion, index) => [Object.keys(suggestions)[index], suggestion])
        .filter(value => value[1] === null || typeof value[1] !== "object" || value[1].length !== undefined));
        
      Object.values(suggestions).forEach((suggestion, index) => {
        const key = Object.keys(suggestions)[index];
        if (suggestion === null || typeof suggestion !== "object" || suggestion.length !== undefined) suggestions[key] = client.db.cache.suggestions[key] || null;
      });
    } else {
      reject(new Error('O valor deve ser um objeto!'));
      return false;
    };
  };
  return true;   
};