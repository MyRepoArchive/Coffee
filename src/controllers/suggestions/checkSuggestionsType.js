module.exports = (suggestions) => {
  if (suggestions === null || typeof suggestions !== "object" || suggestions.length !== undefined) {
    reject(new Error('O parâmetro "suggestions" deve ser um objeto'))
    return false;
  }
  return true;
};