module.exports = {
  config: require('./src/config'),

  run({ message, permissions }) {
    if (permissions.has('SEND_MESSAGES')) message.channel.send('RANDAMDAM').then(() => {
      setTimeout(() => message.channel.send('PA').catch(() => {}), 2000)
    }, () => {});
  }
};