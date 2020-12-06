const levenshteinDistance = require("./levenshteinDistance");

module.exports = (word = '', array = []) => {
  if (!array.length || !word) return;

  return array.reduce((similar = '', value) => levenshteinDistance(value, word) < levenshteinDistance(value, similar) ? similar = value : similar);
};