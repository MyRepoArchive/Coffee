const db = require('../utils/connectDb');
const { addReq } = require('../functions');
const cache = require('../utils/cache');

module.exports = {
  index(req, res) {
    addReq(1, 0);

    if (cache.globalPurchases.length > 0) return res.json(cache.globalPurchases);

    addReq(0, 1);

    db.query('SELECT * FROM global_purchases', (err, result) => {
      if(err) throw err;

      cache.globalPurchases = result;

      return res.json(result);
    });
  },

  findById(req, res) {
    addReq(1, 0);

    const { id } = req.params;

    if(isNaN(id)) return res.status(400).send({ error: "The given ID is not valid!" });

    if (cache.globalPurchases.length > 0) return res.json(cache.globalPurchases.find(globalPurchase => globalPurchase.id == id));

    addReq(0, 1);

    db.query('SELECT * FROM global_purchases WHERE id = ?', [id], (err, result) => {
      if(err) throw err;
      return res.json(result[0]);
    });
  },

  bulkDelete(req, res) {
    addReq(1, 0);

    const { ids } = req.body;

    if (!ids) return res.status(400).send({ error: "No array provided!" });
    if (ids.length === 0) return res.status(200).send({ warning: 'No purchases were deleted' });

    const sql = `DELETE FROM global_purchases WHERE id = '${ids.join("' OR id = '")}'`

    db.query(sql, (err, result) => {
      addReq(0, 1);

      if (err) return res.status(500).send({ error: "Error when removing purchases in the database", sqlError: err });

      cache.globalPurchases.forEach((purchase, index) => ids.includes(`${purchase.id}`) && cache.globalPurchases.splice(index, 1));

      return res.json({ result, sql });
    });
  }
}