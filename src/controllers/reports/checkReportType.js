const client = require("../..");

module.exports = (reports, ignore, obs, reject) => {
  if (Object.values(reports).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length) {
    if (ignore) {
      obs.ignoredValues.push(Object.values(reports).map((report, index) => [Object.keys(reports)[index], report])
        .filter(value => value[1] === null || typeof value[1] !== "object" || value[1].length !== undefined));
        
      Object.values(reports).forEach((report, index) => {
        const key = Object.keys(reports)[index];
        if (report === null || typeof report !== "object" || report.length !== undefined) reports[key] = client.db.cache.reports[key] || null;
      });
    } else {
      reject(new Error('O valor deve ser um objeto!'));
      return false;
    };
  };
  return true;   
};