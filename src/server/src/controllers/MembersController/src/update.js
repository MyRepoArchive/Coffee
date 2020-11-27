const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { members } = req.body;

  if (!members) return res.status(400).send({ error: msgs.missProps });
  if (typeof members !== "object") return res.status(400).send({ error: msgs.notObject });

  const properties = Object.keys(members);
  const values = Object.values(members);

  if (!properties.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length || value.find(update => update.id === undefined || typeof update.id !== "number" || update.value === undefined)))
    return res.status(400).send({ error: msgs.missPropsInAnItem });
  
  const ids = [...new Set(properties.map(property => members[property].map(update => update.id)).reduce((prev, curr) => prev.concat(curr)))];

  const sql = `UPDATE members SET ${properties.map(property => {
    return (`${property} = CASE id ${members[property].map(update => {
      return `WHEN ${update.id} THEN ${update.value === null ? null : `'${update.value}'`}`
    }).join(' ')} ELSE ${property} END`);
  }).join(', ')} WHERE id IN (${ids.join(', ')})`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.updateErr, sqlError: err });

    cache.members.forEach((member, index) => {
      properties.forEach(property => members[property].forEach(value => {
        if (member.id === value.id) cache.members[index][property] = value.value;
      }));
    });

    const updated = cache.members.filter(member => ids.includes(member.id)).length ? 
      cache.members.filter(member => ids.includes(member.id)) : 
      undefined;

    return res.json({ result, sql, members: updated });
  });
};