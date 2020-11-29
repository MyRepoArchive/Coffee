const client = require('../..');

module.exports = () => {
  client.db.create = require('../../controllers/create');
};