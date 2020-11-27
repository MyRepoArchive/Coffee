const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { reports } = req.body;

  if (!reports) return res.status(400).send({ error: msgs.missProps });
  if (typeof reports !== "object") return res.status(400).send({ error: msgs.notObject });

  const properties = Object.keys(reports);
  const values = Object.values(reports);

  if (!properties.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length || value.find(update => update.id === undefined || typeof update.id !== "number" || update.value === undefined)))
    return res.status(400).send({ error: msgs.missPropsInAnItem });
  
  const ids = [...new Set(properties.map(property => reports[property].map(update => update.id)).reduce((prev, curr) => prev.concat(curr)))];

  const sql = `UPDATE reports SET ${properties.map(property => {
    return (`${property} = CASE id ${reports[property].map(update => {
      return `WHEN ${update.id} THEN ${update.value === null ? null : `'${update.value}'`}`
    }).join(' ')} ELSE ${property} END`);
  }).join(', ')} WHERE id IN (${ids.join(', ')})`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.updateErr, sqlError: err });

    cache.reports.forEach((report, index) => {
      properties.forEach(property => reports[property].forEach(value => {
        if (report.id === value.id) cache.reports[index][property] = value.value;
      }));
    });

    const updated = cache.reports.length ? 
      cache.reports.filter(report => ids.includes(report.id)).forEach((report, index) => {
        String.fromCharCode(...report.report.split(' '))
      }) : 
      undefined;

    return res.json({ result, sql, reports: updated });
  });
}; 