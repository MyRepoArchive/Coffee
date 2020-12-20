module.exports = {
  config: require('./src/config'),

  run({ message, permissions }) {
    if (permissions.has('SEND_MESSAGES')) message.channel.send('RANDAMDAM', { files: ['./src/assets/audios/randandanPA.mp3'] }).then(() => {
      setTimeout(() => message.channel.send('PA').catch(() => {}), 2000)
    }, () => {});
  }
};