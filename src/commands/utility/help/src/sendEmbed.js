const { static: { eID } } = require('../../../../utils/emojis.json');

module.exports = (embed, permissions, message) => {
  if (permissions.has('SEND_MESSAGES')) {
    message.channel.send(embed).catch(() => dm())
  } else dm();
  
  function dm() {
    message.author.send(embed).catch(e => {
      if (permissions.has('ADD_REACTIONS')) message.react(eID.emojicoffeeerro).catch(() => {});
    });
  };
};