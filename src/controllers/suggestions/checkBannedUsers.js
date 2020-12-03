const client = require("../..");

module.exports = (suggestions, ignore, obs, reject) => {
  if (Object.values(suggestions).filter(report => Object.keys(client.db.cache.banned_users).includes(report.created_by)).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(suggestions).map((report, index) => [Object.keys(suggestions)[index], report])
        .filter(report => Object.keys(client.db.cache.banned_users).includes(report[1].created_by)));
      obs.ignoredValues.forEach(report => suggestions[report[0]] = null);
    } else {
      reject(new Error('Um ou mais suggestions foram feitos por usuários banidos!'));
      return false;
    };
  };
  return true;
};