const cache = require('../../../utils/cache');
const { addReq } = require('../../../functions');
const db = require('../../../utils/connectDb');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { id } = req.params;

  if (isNaN(id)) return res.status(400).send({ error: msgs.anIdNotNumber });

  if (cache.servers.length) return res.json(cache.servers.find(server => server.id === id));

  db.query(`SELECT * FROM servers WHERE id = ?`, [id], (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    return res.json(result[0]);
  });
};