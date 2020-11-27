const db = require('../../utils/connectDb');
const bcrypt = require('bcryptjs');
const { generateToken, addReq } = require('../../functions');
const { getUser } = require('../UsersController');
const msgs = require('../../utils/msgs.json');
const cache = require('../../utils/cache');

module.exports = {
  async index(req, res) {
    addReq(1, 0);
    
    const { id, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    try {
      const preUser = await getUser(id);
      const timestamp = Date.now();
      
      if (preUser && preUser.password) return res.status(400).send({ error: "User already exists" });

      db.query('INSERT INTO users (id, password, timestamp) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?', 
        [id, hash, timestamp, hash],
        async (err, result) => {
          addReq(0, 1);

          if (err) return res.status(500).send({ error: msgs.registerFailed, sqlError: err });

          if (cache.users.length) {
            const haveUsers = cache.users.map((user, index) => {
              if (user.id === id) {
                cache.users[index].password = hash
                return true;
              };
            });

            if (!haveUsers.includes(true)) cache.users.push({
              id,
              money: 0,
              daily_timestamp: 0,
              consecutive_days: 0,
              job: 0,
              password: hash,
              admin: 0,
              timestamp
            });
          };

          const user = cache.users.find(user => user.id === id) || await getUser(id);

          user.password = undefined;

          return res.json({ result, user, token: generateToken({ id }) });
        }
      );
    } catch (e) {
      return res.status(500).send({ error: msgs.registerFailed, stack: e });
    };
  },
};