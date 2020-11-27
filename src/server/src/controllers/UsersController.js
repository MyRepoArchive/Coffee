const db = require('../utils/connectDb');
const cache = require('../utils/cache');
const { addReq } = require('../functions');

module.exports = {
  index(req, res) {
    const { addReq } = require('../functions');
    addReq(1, 0);

    if (cache.users.length > 0 && req.userid && cache.users.find(user => user.user_id === req.userid)) {
      if(cache.users.find(user => user.user_id === req.userid).admin === 2 || cache.users.find(user => user.user_id === req.userid).admin === 1) {
        return res.json(cache.users);
      } else {
        return res.json(cache.users.map(user => user.password = undefined));
      }
    };

    addReq(0, 1);

    db.query(`SELECT * FROM users`, (err, result) => {
      if (err) throw err;
      
      const userToken = result.find(user => user.user_id === req.userid);

      if (req.userid && userToken && (userToken.admin === 2 || userToken.admin === 1)) {
        cache.users = result;
        return res.json(result);
      };

      result.forEach(user => user.password = undefined);

      return res.json(result);
    });
  },

  findById(req, res) {
    const { addReq } = require('../functions');
    addReq(1, 0);

    const { id } = req.params;

    if(isNaN(id)) return res.status(400).send({ error: "The given ID is not valid!" });

    if (cache.users.length > 0 && req.userid && cache.users.find(user => user.user_id === req.userid)) {
      if (cache.users.find(user => user.user_id === req.userid).admin === 2 || cache.users.find(user => user.user_id === req.userid).admin === 1) {
        return res.json(cache.users.find(user => user.user_id == id));
      } else {
        return res.json(cache.users.map(user => user.password = undefined).find(user => user.user_id == id));
      }
    };

    addReq(0, 1);

    db.query(`SELECT * FROM users WHERE user_id = ?`,[id], (err, result) => {
      if (err) throw err;

      if(result[0]) {
        if (req.userid && result[0].user_id === req.userid && (result[0].admin === 2 || result[0].admin === 1)) return res.json(result[0]);

        result[0].password = undefined;
      } else {
        return res.status(400).send({ error: "User not exists" });
      };

      return res.json(result[0]);
    })
  },

  getUser(id) {
    return new Promise((resolve, reject) => db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
      addReq(0, 1, result[0]);

      err ? reject(err) : resolve(result[0]);
    }));
  }
}