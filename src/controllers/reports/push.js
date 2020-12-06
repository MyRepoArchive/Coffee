const checkPushReportsType = require('./checkPushReportsType');
const checkBannedUsers = require('./checkBannedUsers');
const checkReportType = require('./checkReportType');
const setPushDefaults = require('./setPushDefaults');
const checkIncorrectReports = require('./checkIncorrectReports');
const client = require('../..');
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require('../../functions/error');

module.exports = (reports, { ignore = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: []
  };

  if (!checkPushReportsType(reports) || !checkBannedUsers(reports, ignore, obs, reject) || !checkReportType(reports, ignore, obs, reject)) return;

  setPushDefaults(reports);

  const obj = {};
  Object.values(reports).forEach(report => obj[report.id] = report);
  reports = obj;

  if (!checkIncorrectReports(reports, ignore, obs, reject)) return;

  client.db.ref('reports').update(reports).then(() => {
    Object.values(reports).forEach((report, index) => {
      const key = Object.keys(reports)[index];

      client.db.cache.reports[key] = report;
    });

    client.db.ref('last_id').set(client.db.cache.last_id + Object.keys(reports).length);

    client.db.cache.last_id = client.db.cache.last_id + Object.keys(reports).length;

    resolve({ reports: client.db.cache.reports, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais reports!\n' +
    `> Path: "${__filename}"\n` +
    `> Reports: ${JSON.stringify(reports, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});