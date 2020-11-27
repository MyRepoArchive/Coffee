const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { suggestions } = req.body;

  if (!suggestions) return res.status(400).send({ error: msgs.missProps });
  if (typeof suggestions !== "object") return res.status(400).send({ error: msgs.notObject });

  const properties = Object.keys(suggestions);
  const values = Object.values(suggestions);

  if (!properties.length) return res.status(400).send({ error: msgs.emptyObject });
  if (values.find(value => typeof value !== "object" || !value.length || value.find(update => update.id === undefined || typeof update.id !== "number" || update.value === undefined)))
    return res.status(400).send({ error: msgs.missPropsInAnItem });

  const ids = [...new Set(properties.map(property => suggestions[property].map(update => update.id)).reduce((prev, curr) => prev.concat(curr)))];

  const sql = `UPDATE suggestions SET ${properties.map(property => {
    return (`${property} = CASE id ${suggestions[property].map(update => {
      return `WHEN ${update.id} THEN ${update.value === null ? null : `'${update.value}'`}`
    }).join(' ')} ELSE ${property} END`);
  }).join(', ')} WHERE id IN (${ids.join(', ')})`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.updateErr, sqlError: err });

    cache.suggestions.forEach((suggestion, index) => {
      properties.forEach(property => suggestions[property].forEach(value => {
        if (suggestion.id === value.id) cache.suggestions[index][property] = value.value;
      }));
    });

    const updated = cache.suggestions.length ?
      cache.suggestions.filter(suggestion => ids.includes(suggestion.id)).forEach((suggestion, index) => {
        String.fromCharCode(...suggestion.suggestion.split(' '))
      }) :
      undefined;

    return res.json({ result, sql, suggestions: updated });
  });
}; 