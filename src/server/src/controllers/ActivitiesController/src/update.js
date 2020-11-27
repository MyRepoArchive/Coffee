const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { activities } = req.body;

  if (!activities) return res.status(400).send({ error: msgs.missProps });
  if (typeof activities !== "object") return res.status(400).send({ error: msgs.notObject });

  const properties = Object.keys(activities);
  const values = Object.values(activities);

  if (!properties.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length || value.find(update => update.id === undefined || typeof update.id !== "number" || update.value === undefined)))
    return res.status(400).send({ error: msgs.missPropsInAnItem });
  
  const ids = [...new Set(properties.map(property => activities[property].map(update => update.id)).reduce((prev, curr) => prev.concat(curr)))];

  const sql = `UPDATE activities SET ${properties.map(property => {
    return (`${property} = CASE id ${activities[property].map(update => {
      return `WHEN ${update.id} THEN ${update.value === null ? null : `'${update.value}'`}`
    }).join(' ')} ELSE ${property} END`);
  }).join(', ')} WHERE id IN (${ids.join(', ')})`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.updateErr, sqlError: err });

    cache.activities.forEach((activity, index) => {
      properties.forEach(property => activities[property].forEach(value => {
        if (activity.id === value.id) cache.activities[index][property] = value.value;
      }));
    });

    const updated = cache.activities.length ? 
      cache.activities.filter(activity => ids.includes(activity.id)) : 
      undefined;

    return res.json({ result, sql, activities: updated });
  });
}; 