const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  let { properties, limit } = req.query;
  
  if (properties) properties = JSON.parse(properties) 
  else return res.status(400).send({ error: msgs.missProps });
  if (typeof properties !== "object") return res.status(400).send({ error: msgs.notObject });
  if (limit) limit = Number(limit);

  const props = Object.keys(properties);
  const values = Object.values(properties);

  if (!props.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length)) res.status(400).send({ error: msgs.missPropsInAnItem });

  const sql = `DELETE FROM inventory WHERE ${props.map(property => {
    return `${property} IN (${properties[property].map(value => typeof value === 'string' ? `'${value}'` : value).join(', ')})`
  }).join(' AND ')} ORDER BY id ${(limit === undefined || limit === null || limit === Infinity || typeof limit !== "number") ? '' : `LIMIT ${limit}`}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.delErr, sqlError: err });

    const deleted = cache.inventory.length ?
      (
        props.map(prop => {
          return cache.inventory.filter(item => properties[prop].includes(item[prop]));
        })
          .reduce((prev, curr) => prev.filter(value => curr.some(element => element.id === value.id)))
          .sort((a, b) => a.id - b.id)
          .slice(0, (limit === undefined || limit === null || typeof limit !== "number") ? Infinity : limit)
      ) : undefined;
    
    if (deleted) deleted.forEach(deleted => cache.inventory.splice(cache.inventory.findIndex(item => item.id === deleted.id), 1));

    return res.json({ result, sql, inventory: deleted });
  });
};