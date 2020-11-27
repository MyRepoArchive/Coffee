const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { userid } = req;

  if (cache.inventory.length) return res.json(cache.inventory.filter(item => item.user === userid)); 

  db.query('SELECT * FROM inventory WHERE user = ?', [userid], (err, result) => {
    addReq(0, 1);
    
    if(err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    return res.json(result);
  });
};