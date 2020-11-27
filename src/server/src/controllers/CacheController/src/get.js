const cache = require('../../../utils/cache');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { property } = req.params;

  if (!property) return res.status(400).send({ error: msgs.missProps });
  if (cache[property] === undefined) return res.status(400).send({ error: "Invalid property" });

  return res.json(cache[property]);
};