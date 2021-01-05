const notProvidedFilter = require('./src/notProvidedFilter');
const genPages = require('./src/genPages');
const embedPagination = require('../../../functions/embedPagination');

module.exports = {
  config: require('./src/config'),

  run({ message, args, permissions }) {
    const param = args[0]?.toUpperCase();

    if (!param) return notProvidedFilter(permissions, message);

    switch (param) {
      case 'ACTIVE': 
        embedPagination(genPages(message, (cmd) => cmd.config.active), permissions, message)
        break;
      case 'INACTIVE':
        embedPagination(genPages(message, (cmd) => !cmd.config.active), permissions, message)
        break;
      case 'WITH_IMAGE': 
        embedPagination(genPages(message, (cmd) => cmd.config.example_url), permissions, message)
        break;
      case 'WITHOUT_IMAGE': 
        embedPagination(genPages(message, (cmd) => !cmd.config.example_url), permissions, message)
        break;
      default: 
        notProvidedFilter(permissions, message);
        break;
    }
  }
}