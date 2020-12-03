const client = require("../..");

module.exports = (suggestions) => {
  Object.values(suggestions).forEach((suggestion, index) => {
    if (suggestion === null) return;

    const key = client.db.cache.last_id + 1 + index;

    if (!suggestion.created_timestamp) suggestion.created_timestamp = Date.now();
    suggestion.id = key;
    if (!suggestion.status) suggestion.status = "EM ANALISE"

    suggestions[index] = suggestion;
  });
};