const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { user, server } = req.body;

  if (!user || !server) return res.status(400).send({ error: msgs.missProps });
  if (typeof user !== "string" || typeof server !== "string") return res.status(400).send({ error: msgs.notString });

  if (cache.members.length) return res.json(cache.members.find(member => member.user === user && member.server === server)); 

  db.query('SELECT * FROM members WHERE user = ? AND server = ?', [user, server], (err, result) => {
    addReq(0, 1);
    
    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    return res.json(result[0]);
  });
};