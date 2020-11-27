const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  if (cache.members.length) return res.json(cache.members);

  db.query('SELECT * FROM members', (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    cache.members = result;

    return res.json(result);
  });
};