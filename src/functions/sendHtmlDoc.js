const client = require('../..');
const genFakeMessage = require('./genFakeMessage');
const genHtmlMessage = require('./genHtmlMessage');

module.exports = (e, msg, channel, errSend, id) => new Promise((resolve, reject) => {
  if (e.name === 'DiscordAPIError' && e.code === 50035) {
    const name = msg.slice(0, 100).replace(/ /g, '_').replace(/\W/g, '') + '.html';
    const attachment = Buffer.from(genHtmlMessage(genFakeMessage(client.user, msg)));

    channel.send({ files: [{ name, attachment }] }).catch(e => errSend(e, channel, id))

    resolve();
  } else {
    reject();
  };
});