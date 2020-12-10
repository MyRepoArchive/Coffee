const client = require('../../..');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown')
const { admins } = require('../../../config/default.json');
const unauthorized = require('./src/unauthorized');
const notProvidedPrefix = require('./src/notProvidedPrefix');
const set = require('./src/set');

module.exports = {
  config: require('./src/config'),

  run({ message, args }) {
    if (!verifyActiveCooldown(message, this.config)) return;

    const oldPrefix = client.db.cache.prefixes[message.guild.id];
    const newPrefix = args.join(' ');
    const guildPerms = message.member.permissions;
    const permissions = message.channel.permissionsFor(client.user);

    if (!guildPerms.has('MANAGE_GUILD') && !guildPerms.has('ADMINISTRATOR') && !admins.includes(message.author.id)) 
      return unauthorized(message, permissions);

    if (!newPrefix) return notProvidedPrefix(message, permissions, oldPrefix);

    set(oldPrefix, newPrefix, message, permissions);
  }
}