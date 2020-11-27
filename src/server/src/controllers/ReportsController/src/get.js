const cache = require('../../../utils/cache');
const db = require('../../../utils/connectDb');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');

module.exports = (req, res) => {
  addReq(1, 0);

  const { id } = req.params;

  if (isNaN(id)) return res.status(400).send({ error: msgs.anIdNotNumber });

  if(cache.reports.length) return res.json(cache.reports.find(command => command.id == id)); 

  db.query('SELECT * FROM reports WHERE id = ?', [id], (err, result) => {
    addReq(0, 1);
    
    if(err) return res.status(500).send({ error: msgs.fetchErr, sqlError: err });

    result[0].report = String.fromCharCode(...result[0].report.split(' '));

    return res.json(result[0]);
  });
};