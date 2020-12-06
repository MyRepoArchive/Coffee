module.exports = (reports) => {
  Object.values(reports).forEach((report, index) => {
    if (report === null) return;

    const key = Object.keys(reports)[index];

    if (!report.created_timestamp) report.created_timestamp = Date.now();
    if (!report.id) report.id = Number(key);
    if (!report.status) report.status = "EM ANALISE"

    reports[key] = report;
  });
};