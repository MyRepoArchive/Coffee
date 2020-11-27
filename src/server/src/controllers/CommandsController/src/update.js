const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');
const api = require('../../../services/botApi');

module.exports = (req, res) => {
  addReq(1, 0);

  const { commands } = req.body;

  if (!commands) return res.status(400).send({ error: msgs.missProps });
  if (typeof commands !== "object") return res.status(400).send({ error: msgs.notObject });

  const properties = Object.keys(commands);
  const values = Object.values(commands);

  if (!properties.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length || value.find(update => update.id === undefined || typeof update.id !== "number" || update.value === undefined)))
    return res.status(400).send({ error: msgs.missPropsInAnItem });
  
  const ids = [...new Set(properties.map(property => commands[property].map(update => update.id)).reduce((prev, curr) => prev.concat(curr)))];

  const sql = `UPDATE commands SET ${properties.map(property => {
    return (`${property} = CASE id ${commands[property].map(update => {
      return `WHEN ${update.id} THEN ${update.value === null ? null : (
        typeof update.value === "object" ? `'${JSON.stringify(update.value)}'` : `'${update.value}'`
      )}`
    }).join(' ')} ELSE ${property} END`);
  }).join(', ')} WHERE id IN (${ids.join(', ')})`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.updateErr, sqlError: err });

    api.post('/commands/update');

    cache.commands.forEach((command, index) => {
      properties.forEach(property => commands[property].forEach(value => {
        if (command.id === value.id) cache.commands[index][property] = value.value;
      }));
    });

    const updated = cache.commands.length ? 
      cache.commands.filter(command => ids.includes(command.id)) : 
      undefined;

    return res.json({ result, sql, commands: updated });
  });
}; 