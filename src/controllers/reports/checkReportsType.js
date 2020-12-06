module.exports = (reports) => {
  if (reports === null || typeof reports !== "object" || reports.length !== undefined) {
    reject(new Error('O parâmetro "reports" deve ser um objeto'))
    return false;
  }
  return true;
};