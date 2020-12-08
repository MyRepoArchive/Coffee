const checkReportsType = require('./checkReportsType');
const checkBannedUsers = require('./checkBannedUsers');
const checkKeys = require('../../functions/checkKeys');
const checkReportType = require('./checkReportType');
const setDefaults = require('./setDefaults');
const checkIncorrectReports = require('./checkIncorrectReports');
const client = require('../..');
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require('../../functions/error');

module.exports = (reports, { ignore = false, orCreate = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    createdKeys: [],
    nonExistent: []
  };

  if (!checkReportsType(reports) || !checkBannedUsers(reports, ignore, obs, reject) || !checkKeys(reports, ignore, obs, reject) || !checkReportType(reports, ignore, obs, reject)) return;

  setDefaults(reports);

  if (!checkIncorrectReports(reports, ignore, obs, reject)) return;

  if (Object.keys(reports).filter(key => !client.db.cache.reports[key]).length) {
    if (orCreate) {
      obs.createdKeys = Object.keys(reports).filter(key => !client.db.cache.reports[key]);
    } else if (ignore) {
      obs.nonExistent = Object.keys(reports).filter(key => !client.db.cache.reports[key]);
      obs.nonExistent.forEach(key => reports[key] = null);
    } else {
      return reject(new Error('Um dos reports não existe!'));
    };
  };

  client.db.ref('reports').update(reports).then(() => {
    Object.values(reports).forEach((report, index) => {
      const key = Object.keys(reports)[index];

      client.db.cache.reports[key] = report;
    });

    resolve({ reports: client.db.cache.reports, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao atualizar um ou mais reports!\n' +
    `> Path: "${__filename}"\n` +
    `> Reports: ${JSON.stringify(reports, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});