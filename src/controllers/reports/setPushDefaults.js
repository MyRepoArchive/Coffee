const client = require("../..");

module.exports = (reports) => {
  Object.values(reports).forEach((report, index) => {
    if (report === null) return;

    const key = client.db.cache.last_id + 1 + index;

    if (!report.created_timestamp) report.created_timestamp = Date.now();
    report.id = key;
    if (!report.status) report.status = "EM ANALISE"

    reports[key] = report;
  });
};