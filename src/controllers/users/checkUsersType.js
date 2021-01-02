module.exports = (users, reject) => {
  if (users === null || typeof users !== "object" || users.length !== undefined) {
    reject(new Error('O parâmetro "users" deve ser um objeto'))
    return false;
  }
  return true;
};