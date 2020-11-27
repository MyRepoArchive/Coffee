const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.json');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return next();

  const parts = authorization.split(' ');

  if (parts.length !== 2) return res.status(401).send({ error: 'Token error' });

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformatted' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });

    req.userid = decoded.id;
    
    return next();
  });
};