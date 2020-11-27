const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { suggestions } = req.body;

  if (!suggestions) return res.status(400).send({ error: msgs.missProps });
  if (typeof suggestions !== "object") return res.status(400).send({ error: msgs.notArray });
  if (!suggestions.length) return res.status(400).send({ error: msgs.emptyArray });
  if (suggestions.find(suggestion => !suggestion.suggestion || !suggestion.created_by)) return res.status(400).send({ error: msgs.missPropsInAnItem });

  suggestions.forEach((suggestion, index) => {
    if (!suggestion.status) suggestions[index].status = "EM ANALISE";
    suggestion.created_timestamp = Date.now();
    suggestion.suggestion = suggestion.suggestion.replace(/\\/g, '\\\\').split('').map(item => item.charCodeAt(0)).join(' ');
  });

  const sql = `INSERT INTO suggestions (suggestion, created_by, created_timestamp, status) VALUES ${suggestions.map(suggestion => {
    return `('${suggestion.suggestion}', '${suggestion.created_by}', '${suggestion.created_timestamp}', '${suggestion.status}')`;
  }).join(', ')}`;

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.createErr, sqlError: err });

    suggestions.forEach((suggestion, index) => suggestions[index].id = result.insertId + index);

    if (cache.suggestions.length) cache.suggestions.push(...suggestions);

    suggestions.forEach((suggestion, index) => suggestions[index].suggestion = String.fromCharCode(...suggestion.suggestion.split(' ')));

    return res.json({ result, sql, suggestions });
  });
};