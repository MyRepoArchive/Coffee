const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { reports } = req.body;

  if (!reports) return res.status(400).send({ error: msgs.missProps });
  if (typeof reports !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!reports.length) return res.status(400).send({ error: msgs.emptyArray });
  if (reports.find(report => !report.report || !report.created_by)) return res.status(400).send({ error: msgs.missPropsInAnItem });

  reports.forEach((report, index) => {
    if (!report.status) reports[index].status = "EM ANALISE";
    report.created_timestamp = Date.now();
    report.report = report.report.replace(/\\/g, '\\\\').split('').map(item => item.charCodeAt(0)).join(' ');
  });

  const sql = `INSERT INTO reports (report, created_by, created_timestamp, status) VALUES ${reports.map(report => {
    return `('${report.report}', '${report.created_by}', '${report.created_timestamp}', '${report.status}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    reports.forEach((report, index) => reports[index].id = result.insertId + index);

    if (cache.reports.length) cache.reports.push(...reports);

    reports.forEach((report, index) => reports[index].report = String.fromCharCode(...report.report.split(' ')));

    return res.json({ result, sql, reports });
  });
};