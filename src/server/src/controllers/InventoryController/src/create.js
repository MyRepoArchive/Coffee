const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { inventory } = req.body;

  if (!inventory) return res.status(400).send({ error: msgs.missProps });
  if (typeof inventory !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!inventory.length) return res.status(400).send({ error: msgs.emptyArray });
  if (inventory.find(item => !item.user || !item.product || typeof item.product !== "number" || !item.scope)) 
    return res.status(400).send({ error: msgs.missPropsInAnItem });

  inventory.forEach((item, index) => {
    if (!item.server) inventory[index].server = null;
    item.active ? inventory[index].active = 1 : inventory[index].active = 0;
    inventory[index].timestamp = Date.now();
  });

  const sql = `INSERT INTO inventory (user, server, timestamp, product, active, scope) VALUES ${inventory.map(item => {
    return `('${item.user}', ${item.server ? `'${item.server}'` : null}, '${item.timestamp}', '${item.product}', '${item.active}', '${item.scope}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    if (cache.inventory.length) {
      inventory.forEach((item, index) => inventory[index].id = result.insertId + index);
      cache.inventory.push(...inventory);
    };

    return res.json({ result, sql, inventory });
  });
};