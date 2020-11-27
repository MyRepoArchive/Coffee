const cache = require('../../../utils/cache');
const { addReq } = require('../../../functions');
const db = require('../../../utils/connectDb');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  if (cache.servers.length) return res.json(cache.servers);

  db.query(`SELECT * FROM servers`, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    cache.servers = result;

    return res.json(result);
  });
};