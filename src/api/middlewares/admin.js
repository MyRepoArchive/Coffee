const jwt = require('jsonwebtoken');
const client = require('../..');
const { secret } = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send({ message: "No token provided" });

  const parts = authorization.split(' ');

  if (parts.length !== 2) return res.status(401).send({ message: 'Token error' });

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme)) return res.status(401).send({ message: 'Token malformatted' });

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Token invalid' });

    const user = client.db.cache.users[decoded.id];

    if (user && user.admin) return next();

    return res.status(401).send({ message: 'Unauthorized user' });
  });
};