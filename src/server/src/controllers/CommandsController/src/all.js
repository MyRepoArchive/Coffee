const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  if (cache.commands.length) return res.json(cache.commands);

  db.query('SELECT * FROM commands', (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    cache.commands = result;

    return res.json(result);
  });
};