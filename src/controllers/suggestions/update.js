const checkSuggestionsType = require('./checkSuggestionsType');
const checkBannedUsers = require('./checkBannedUsers');
const checkKeys = require('../../functions/checkKeys');
const checkSuggestionType = require('./checkSuggestionType');
const setDefaults = require('./setDefaults');
const checkIncorrectSuggestions = require('./checkIncorrectSuggestions');
const client = require('../..');
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require('../../functions/error');

module.exports = (suggestions, { ignore = false, orCreate = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    createdKeys: [],
    nonExistent: []
  };

  if (!checkSuggestionsType(suggestions) || !checkBannedUsers(suggestions, ignore, obs, reject) || !checkKeys(suggestions, ignore, obs, reject) || !checkSuggestionType(suggestions, ignore, obs, reject)) return;

  setDefaults(suggestions);

  if (!checkIncorrectSuggestions(suggestions, ignore, obs, reject)) return;

  if (Object.keys(suggestions).filter(key => !client.db.cache.suggestions[key]).length) {
    if (orCreate) {
      obs.createdKeys = Object.keys(suggestions).filter(key => !client.db.cache.suggestions[key]);
    } else if (ignore) {
      obs.nonExistent = Object.keys(suggestions).filter(key => !client.db.cache.suggestions[key]);
      obs.nonExistent.forEach(key => suggestions[key] = null);
    } else {
      return reject(new Error('Um dos suggestions não existe!'));
    };
  };

  client.db.ref('suggestions').update(suggestions).then(() => {
    Object.values(suggestions).forEach((suggestion, index) => {
      const key = Object.keys(suggestions)[index];

      client.db.cache.suggestions[key] = suggestion;
    });

    resolve({ suggestions: client.db.cache.suggestions, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao atualizar um ou mais suggestions!\n' +
    `> Path: "${__filename}"\n` +
    `> Suggestions: ${JSON.stringify(suggestions, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});