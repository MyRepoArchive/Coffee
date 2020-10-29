module.exports = (word = '', array = []) => {
  const { levenshteinDistance } = require('..')
  
  if (!array.length || !word) return;

  return array.reduce((similar = '', value) => levenshteinDistance(value, word) < levenshteinDistance(value, similar) ? similar = value : similar);
};