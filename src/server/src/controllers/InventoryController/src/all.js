const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { joinProducts } = req.query;

  if (joinProducts && cache.inventory.length && cache.products.length) {
    return res.json(cache.inventory.map(item => {
      const product = cache.products.find(product => product.id === item.product);

      item.ID = item.id;
      item.TIMESTAMP = item.timestamp

      Object.keys(product).forEach(key => item[key] = product[key]);

      return item;
    }));
  } else if (!joinProducts && cache.inventory.length) return res.json(cache.inventory);

  const sql = joinProducts ? 
  "SELECT *, inventory.id AS 'ID', inventory.timestamp AS 'TIMESTAMP' FROM inventory JOIN products ON products.id = product" :
  'SELECT * FROM inventory';

  db.query(sql, (err, result) => {
    addReq(0, 1);

    if (err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    if (!joinProducts) cache.inventory = result;

    return res.json(result);
  });
};