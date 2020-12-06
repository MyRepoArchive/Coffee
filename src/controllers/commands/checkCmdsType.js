module.exports = (commands, reject) => {
  if (commands === null || typeof commands !== "object" || commands.length !== undefined) {
    reject(new Error('O parâmetro "commands" deve ser um objeto'));
    return false;
  };
  return true;
};