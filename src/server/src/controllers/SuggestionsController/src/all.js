const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  if (cache.suggestions.length) return res.json(cache.suggestions);

  db.query('SELECT * FROM suggestions', (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    cache.suggestions = result;

    result.forEach((suggestion, index) => result[index].suggestion = String.fromCharCode(...suggestion.suggestion.split(' ')));

    return res.json(result);
  });
};