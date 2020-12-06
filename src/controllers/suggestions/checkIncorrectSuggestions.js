const client = require('../..');
const isEquivalent = require('../../functions/isEquivalent');

module.exports = (suggestions, ignore, obs, reject) => {
  const incorrectSuggestions = Object.values(suggestions).map((suggestion, index) => [Object.keys(suggestions)[index], suggestion]).filter((suggestion, index) => {
    if (suggestion[1] === null) return;

    const key = Object.keys(suggestions)[index];

    return (
      typeof suggestion[1].created_by !== "string" ||
      suggestion[1].created_by === '' ||
      typeof suggestion[1].created_timestamp !== "number" ||
      typeof suggestion[1].id !== "number" ||
      /\D+/g.test(suggestion[1].id) ||
      suggestion[1].id != key ||
      typeof suggestion[1].suggestion !== "string" ||
      suggestion[1].suggestion === '' ||
      typeof suggestion[1].status !== "string" ||
      suggestion[1].status === ''
    );
  });

  if (incorrectSuggestions.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectSuggestions);
      incorrectSuggestions.forEach(suggestion => {
        Object.values(suggestions).forEach(async (re) => {
          await isEquivalent(suggestion[1], re) ? 
          suggestions[suggestion[0]] = client.db.cache.suggestions[suggestion[0]] || null : 
          null;
        });
      });
    } else {
      reject(new Error('Algum suggestion tem propriedades fora do padrão!'));
      return false;
    };
  };
  return true;
};