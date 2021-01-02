const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports  = (message, permissions) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> O valor a ser adicionado deve ser um número!`;

  chatOrDm(msg, permissions, message).catch(() => {});
};