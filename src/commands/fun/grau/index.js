const client = require('../../..');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');

module.exports = {
  config: require('./src/config'),

  run({ message }) {
    if (!verifyActiveCooldown(message, this.config)) return;

    const permissions = message.channel.permissionsFor(client.user);

    if (permissions.has('SEND_MESSAGES')) message.channel.send('RANDAMDAM', { files: ['./src/assets/audios/randandanPA.mp3'] }).then(() => {
      setTimeout(() => message.channel.send('PA').catch(() => {}), 2000)
    }, () => {});
  }
};