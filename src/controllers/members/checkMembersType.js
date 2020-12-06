module.exports = (members, reject) => {
  if (members === null || typeof members !== "object" || members.length !== undefined) {
    reject(new Error('O parâmetro "members" deve ser um objeto'))
    return false;
  }
  return true;
};