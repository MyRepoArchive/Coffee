const cache = require('../../../utils/cache');
const { addReq } = require('../../../functions');
const db = require('../../../utils/connectDb');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { servers, ignore } = req.body;

  if (!servers) return res.status(400).send({ error: msgs.missProps });
  if (typeof servers !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!servers.length) return res.status(400).send({ error: msgs.emptyArray });
  if (servers.find(server => !server.id)) return res.status(400).send({ error: msgs.missPropsInAnItem });

  servers.forEach((server, index) => {
    if (!server.prefix) servers[index].prefix = '_';
    if (!server.welcome || typeof server.welcome !== "object") servers[index].welcome = null;
    servers[index].timestamp = Date.now();
  });

  const sql = `INSERT ${ignore ? 'IGNORE' : ''} INTO servers (id, prefix, welcome, timestamp) VALUES ${servers.map(server => {
    return `('${server.id}', '${server.prefix}', ${server.welcome === null ? null : `'${server.welcome}'`}, '${server.timestamp}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    if (cache.servers.length) cache.servers.push(...servers);

    return res.json({ result, sql, servers });
  });
};