const cache = require('../../../utils/cache');
const { addReq } = require('../../../functions');
const msgs = require('../../../utils/msgs.json');
const db = require('../../../utils/connectDb');
const api = require('../../../services/botApi');

module.exports = (req, res) => {
  addReq(1, 0);

  const propsDb = req.body.props || Object.keys(cache).filter(prop => typeof cache[prop] === "object");

  const withError = [];
  let fetched = 0

  new Promise((resolve) => {
    api.post('/commands/update')
    propsDb.forEach(prop => {
      db.query(`SELECT * FROM ${prop}`, (err, result) => {
        addReq(0, 1);
  
        fetched++;

        if (err) {
          withError.push(prop);
        } else {
          cache[prop] = result;
        };

        if (fetched === propsDb.length) resolve();
      });
    });
  }).then(() => res.json({ cache, withError }));
};