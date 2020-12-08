const client = require('../../..');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');

module.exports = {
  config: require('./src/config'),

  run({ message }) {
    const { active, reason_inactivity, cooldownControl, cooldown, times_limit } = this.config;

    if (!verifyActiveCooldown(message, active, reason_inactivity, cooldownControl, cooldown, times_limit)) return;

    message.channel.send(`\`${client.commands.map(x => x.config.name).join('\`, \`')}\``).catch(() => {});
  }
};