const { static: { emoji } } = require('../../../utils/emojis.json');
const chatOrDm = require('../../../functions/chatOrDm');

module.exports = (message, permissions) => {
  const msg =
    `> ${emoji.emojicoffeeblock} Block!\n` +
    `> ${message.author}, você não tem permissão para utilizar esse comando!`;

  chatOrDm(msg, permissions, message);
};