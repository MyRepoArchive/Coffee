const client = require('../../..');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');
const embedPagination = require('../../../functions/embedPagination');
const genPages = require('./src/genPages');

module.exports = {
  config: require('./src/config'),

  run({ message }) {
    if (!verifyActiveCooldown(message, this.config)) return;

    const permissions = message.channel.permissionsFor(client.user);
    const pages = genPages(message);

    embedPagination(pages, permissions, message);
  }
}