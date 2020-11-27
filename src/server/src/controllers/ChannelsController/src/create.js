const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { channels, ignore } = req.body;

  if (!channels) return res.status(400).send({ error: msgs.missProps });
  if (typeof channels !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!channels.length) return res.status(400).send({ error: msgs.emptyArray });
  if (channels.find(channel => !channel.id || !channel.server)) return res.status(400).send({ error: msgs.missPropsInAnItem });

  channels.forEach((channel, index) => {
    if (!channel.calc_perm) channels[index].calc_perm = 1;
  });

  const sql = `INSERT ${ignore ? 'IGNORE' : ''} INTO channels (id, server, calc_perm) VALUES ${channels.map(channel => {
    return `('${channel.id}', '${channel.server}', '${channel.calc_perm}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    if (cache.channels.length) cache.channels.push(...channels);

    return res.json({ result, sql, channels });
  });
};