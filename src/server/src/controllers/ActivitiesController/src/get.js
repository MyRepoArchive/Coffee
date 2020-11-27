const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { id } = req.params;

  if (isNaN(id)) return res.status(400).send({ error: msgs.anIdNotNumber });

  if (cache.activities.length) return res.json(cache.activities.find(activity => activity.id == id)); 

  db.query('SELECT * FROM activities WHERE id = ?', [id], (err, result) => {
    addReq(0, 1);
    
    if(err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    return res.json(result[0]);
  });
};