const bcrypt = require('bcryptjs');
const { generateToken, addReq } = require('../../functions');
const { getUser } = require('../UsersController');
const msgs = require('../../utils/msgs.json');

module.exports = {
  // Retorna os users
  index(req, res) {
    addReq(1, 0);

    const { id, password } = req.body;

    if (!id || !password) return res.status(400).send({ error: msgs.missProps });

    getUser(id)
      .then(async user => {
        if(!user) return res.status(400).send({ error: "User not found" });
        if(!user.password) return res.status(400).send({ error: "Unregistered user" });
        if(!await bcrypt.compare(password, user.password)) return res.status(400).send({ error: "Invalid password" });
    
        user.password = undefined;
    
        return res.send({ 
          user, 
          token: generateToken({ id: user.id }) 
        });
      }, e => res.status(500).send({ error: msgs.fetchErr }));
  },
};