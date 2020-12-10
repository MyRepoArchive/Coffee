const { static: { eID } } = require('../utils/emojis.json');

module.exports = (msg, permissions, message) => new Promise((resolve, reject) => {
  if (permissions.has('SEND_MESSAGES')) {
    message.channel.send(msg).then(mess => resolve(mess), () => dm())
  } else dm();
  
  function dm() {
    message.author.send(msg).then(mess => resolve(mess), e => {
      if (permissions.has('ADD_REACTIONS')) message.react(eID.emojicoffeeerro).catch(() => {});
      reject(e);
    });
  };
});