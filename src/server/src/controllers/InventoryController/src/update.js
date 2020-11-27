const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { inventory } = req.body;

  if (!inventory) return res.status(400).send({ error: msgs.missProps });
  if (typeof inventory !== "object") return res.status(400).send({ error: msgs.notObject });

  const properties = Object.keys(inventory);
  const values = Object.values(inventory);

  if (!properties.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length || value.find(update => update.id === undefined || typeof update.id !== "number" || update.value === undefined)))
    return res.status(400).send({ error: msgs.missPropsInAnItem });
  
  const ids = [...new Set(properties.map(property => inventory[property].map(update => update.id)).reduce((prev, curr) => prev.concat(curr)))];

  const sql = `UPDATE inventory SET ${properties.map(property => {
    return (`${property} = CASE id ${inventory[property].map(update => {
      return `WHEN ${update.id} THEN ${update.value === null ? null : `'${update.value}'`}`
    }).join(' ')} ELSE ${property} END`);
  }).join(', ')} WHERE id IN (${ids.join(', ')})`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.updateErr, sqlError: err });

    cache.inventory.forEach((item, index) => {
      properties.forEach(property => inventory[property].forEach(value => {
        if (item.id === value.id) cache.inventory[index][property] = value.value;
      }));
    });

    const updated = cache.inventory.length ? 
      cache.inventory.filter(item => ids.includes(item.id)) : 
      undefined;

    return res.json({ result, sql, inventory: updated });
  });
}; 