module.exports = (channels, reject) => {
  if (channels === null || typeof channels !== "object" || channels.length !== undefined) {
    reject(new Error('O parâmetro "channels" deve ser um objeto'))
    return false;
  }
  return true;
};