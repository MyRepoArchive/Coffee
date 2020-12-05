module.exports = (suggestions) => {
  Object.values(suggestions).forEach((suggestion, index) => {
    if (suggestion === null) return;

    const key = Object.keys(suggestions)[index];

    if (!suggestion.created_timestamp) suggestion.created_timestamp = Date.now();
    if (!suggestion.id) suggestion.id = Number(key);
    if (!suggestion.status) suggestion.status = "EM ANALISE"

    suggestions[key] = suggestion;
  });
};