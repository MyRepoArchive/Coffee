const db = require('../utils/connectDb');
const { addReq } = require('../functions');
const cache = require('../utils/cache');

module.exports = {
  index(req, res) {
    addReq(1, 0);

    if (cache.products.length > 0) return res.json(cache.products);

    addReq(0, 1);

    db.query(`SELECT * FROM products`, (err, result) => {
      if(err) throw err;

      cache.products = result;

      return res.json(result)
    });
  },

  findById(req, res) {
    addReq(1, 0);

    const { id } = req.params;

    if(isNaN(id)) return res.status(400).send({ error: "The given ID is not valid!" });

    if (cache.products.length > 0) return res.json(cache.products.find(product => product.id == id));

    addReq(0, 1);

    db.query(`SELECT * FROM products WHERE id = ?`,[id] , (err, result) => {
      if(err) throw err;
      return res.json(result[0]);
    });
  },
}