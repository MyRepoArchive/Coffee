const cache = require('../../../utils/cache');
const { addReq } = require('../../../functions');

module.exports = (req, res) => {
  addReq(1, 0);

  return res.json(cache);
};