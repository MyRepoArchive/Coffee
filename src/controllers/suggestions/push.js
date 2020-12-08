const checkPushSuggestionsType = require('./checkPushSuggestionsType');
const checkBannedUsers = require('./checkBannedUsers');
const checkSuggestionType = require('./checkSuggestionType');
const setPushDefaults = require('./setPushDefaults');
const checkIncorrectSuggestions = require('./checkIncorrectSuggestions');
const client = require('../..');
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require('../../functions/error');

module.exports = (suggestions, { ignore = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
  };

  if (!checkPushSuggestionsType(suggestions) || !checkBannedUsers(suggestions, ignore, obs, reject) || !checkSuggestionType(suggestions, ignore, obs, reject)) return;

  setPushDefaults(suggestions);

  const obj = {};
  Object.values(suggestions).forEach(suggestion => obj[suggestion.id] = suggestion);
  suggestions = obj;

  if (!checkIncorrectSuggestions(suggestions, ignore, obs, reject)) return;

  client.db.ref('suggestions').update(suggestions).then(() => {
    Object.values(suggestions).forEach((suggestion, index) => {
      const key = Object.keys(suggestions)[index];

      client.db.cache.suggestions[key] = suggestion;
    });

    client.db.ref('last_id').set(client.db.cache.last_id + Object.keys(suggestions).length);

    client.db.cache.last_id = client.db.cache.last_id + Object.keys(suggestions).length;

    resolve({ suggestions: client.db.cache.suggestions, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais suggestions!\n' +
    `> Path: "${__filename}"\n` +
    `> Suggestions: ${JSON.stringify(suggestions, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});