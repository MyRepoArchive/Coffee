module.exports = (suggestions) => {
  if (suggestions === null || typeof suggestions !== "object" || suggestions.length === undefined) {
    reject(new Error('O parâmetro "suggestions" deve ser um array'))
    return false;
  }
  return true;
};