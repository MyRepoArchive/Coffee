const client = require('../..');
const isEquivalent = require('../../functions/isEquivalent');

module.exports = (reports, ignore, obs, reject) => {
  const incorrectReports = Object.values(reports).map((report, index) => [Object.keys(reports)[index], report]).filter((report, index) => {
    if (report[1] === null) return;

    const key = Object.keys(reports)[index];

    return (
      typeof report[1].created_by !== "string" ||
      report[1].created_by === '' ||
      typeof report[1].created_timestamp !== "number" ||
      typeof report[1].id !== "number" ||
      /\D+/g.test(report[1].id) ||
      report[1].id != key ||
      typeof report[1].report !== "string" ||
      report[1].report === '' ||
      typeof report[1].status !== "string" ||
      report[1].status === ''
    );
  });

  if (incorrectReports.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectReports);
      incorrectReports.forEach(report => {
        Object.values(reports).forEach(async (re) => {
          await isEquivalent(report[1], re) ? 
          reports[report[0]] = client.db.cache.reports[report[0]] || null : 
          null;
        });
      });
    } else {
      reject(new Error('Algum reports tem propriedades fora do padrão!'));
      return false;
    };
  };
  return true;
};