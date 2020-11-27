const { secret } = require('../../config/auth.json');
const jwt = require('jsonwebtoken');

module.exports = (params = {}) => {
  return jwt.sign(params, secret, { expiresIn: 21600 });
};