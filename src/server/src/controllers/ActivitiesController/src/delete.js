const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { properties, limit } = req.body;

  if (!properties) return res.status(400).send({ error: msgs.missProps });
  if (typeof properties !== "object") return res.status(400).send({ error: msgs.notObject });

  const props = Object.keys(properties);
  const values = Object.values(properties);

  if (!props.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length)) res.status(400).send({ error: msgs.missPropsInAnItem });

  const sql = `DELETE FROM activities WHERE ${props.map(property => {
    return `${property} IN (${properties[property].map(value => typeof value === 'string' ? `'${value}'` : value).join(', ')})`
  }).join(' AND ')} ORDER BY id ${(limit === undefined || limit === null || limit === Infinity || typeof limit !== "number") ? '' : `LIMIT ${limit}`}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.delErr, sqlError: err });

    const deleted = cache.activities.length ?
      (
        props.map(prop => {
          return cache.activities.filter(activity => properties[prop].includes(activity[prop]));
        })
          .reduce((prev, curr) => prev.filter(value => curr.some(element => element.id === value.id)))
          .sort((a, b) => a.id - b.id)
          .slice(0, (limit === undefined || limit === null || typeof limit !== "number") ? Infinity : limit)
      ) : undefined;
    
    if (deleted) deleted.forEach(deleted => cache.activities.splice(cache.activities.findIndex(activity => activity.id === deleted.id), 1));

    return res.json({ result, sql, activities: deleted });
  });
};