const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  if (cache.reports.length) return res.json(cache.reports);

  db.query('SELECT * FROM reports', (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    cache.reports = result;

    result.forEach((report, index) => result[index].report = String.fromCharCode(...report.report.split(' ')));

    return res.json(result);
  });
};