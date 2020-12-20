const embedPagination = require('../../../functions/embedPagination');
const genPages = require('./src/genPages');

module.exports = {
  config: require('./src/config'),

  run({ message, permissions }) {
    const pages = genPages(message);

    embedPagination(pages, permissions, message);
  }
}