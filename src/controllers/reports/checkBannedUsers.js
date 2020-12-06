const client = require("../..");

module.exports = (reports, ignore, obs, reject) => {
  if (Object.values(reports).filter(report => Object.keys(client.db.cache.banned_users).includes(report.created_by)).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(reports).map((report, index) => [Object.keys(reports)[index], report])
        .filter(report => Object.keys(client.db.cache.banned_users).includes(report[1].created_by)));
      obs.ignoredValues.forEach(report => reports[report[0]] = null);
    } else {
      reject(new Error('Um ou mais reports foram feitos por usuários banidos!'));
      return false;
    };
  };
  return true;
};