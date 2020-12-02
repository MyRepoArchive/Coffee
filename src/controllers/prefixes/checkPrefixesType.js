module.exports = (prefixes, reject) => {
  if (prefixes === null || typeof prefixes !== "object" || prefixes.length !== undefined) {
    reject(new Error('O parâmetro "prefixes" deve ser um objeto'));
    return false;
  };
  return true; 
};