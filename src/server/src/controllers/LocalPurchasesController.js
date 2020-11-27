const db = require('../utils/connectDb');
const { addReq } = require('../functions');
const cache = require('../utils/cache');

module.exports = {
  index(req, res) {
    addReq(1, 0);

    if (cache.localPurchases.length > 0) return res.json(cache.localPurchases);

    addReq(0, 1)

    db.query('SELECT * FROM local_purchases', (err, result) => {
      if(err) throw err;

      cache.localPurchases = result;

      return res.json(result);
    });
  },

  findById(req, res) {
    addReq(1, 0);

    const { id } = req.params;

    if(isNaN(id)) return res.status(400).send({ error: "The given ID is not valid!" });

    if (cache.localPurchases.length > 0) return res.json(cache.localPurchases.find(localPurchase => localPurchase.id == id));

    addReq(0, 1);

    db.query('SELECT * FROM local_purchases WHERE id = ?', [id], (err, result) => {
      if(err) throw err;
      return res.json(result[0]);
    });
  },

  bulkDelete(req, res) {
    addReq(1, 0);

    const { ids } = req.body;

    if (!ids) return res.status(400).send({ error: "No array provided!" });
    if (ids.length === 0) return res.status(200).send({ warning: 'No purchases were deleted' });

    const sql = `DELETE FROM local_purchases WHERE id = '${ids.join("' OR id = '")}'`

    db.query(sql, (err, result) => {
      addReq(0, 1);

      if (err) return res.status(500).send({ error: "Error when removing purchases in the database", sqlError: err });

      cache.localPurchases.forEach((purchase, index) => ids.includes(`${purchase.id}`) && cache.globalPurchases.splice(index, 1));

      return res.json({ result, sql });
    });
  }
}