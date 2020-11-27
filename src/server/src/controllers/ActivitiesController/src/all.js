const db = require('../../../utils/connectDb');

module.exports = async (req, res, path) => {
  const { force } = req.query;

  if (force) res.json((await db.ref(`/${path}`).once('value')).val())
  else return res.json(cache[property]);
};