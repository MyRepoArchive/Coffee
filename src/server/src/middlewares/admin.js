const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.json');
const { getUser } = require('../controllers/UsersController');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send({ error: "No token provided" });

  const parts = authorization.split(' ');

  if (parts.length !== 2) return res.status(401).send({ error: 'Token error' });

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformatted' });

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });

    const user = await getUser(decoded.id);

    if (user && (user.admin === 2 || user.admin === 1)) return next();

    res.status(401).send({ error: 'Unauthorized user' });
  });
};