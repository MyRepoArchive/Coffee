const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (message, permissions, prefix) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Você deve passar os parâmetros `user` e `valor` respectivamente logo à frente do comando.\n' +
    `> Para saber mais utilize ${prefix}ajuda setbankmoney.`;

  chatOrDm(msg, permissions, message).catch(() => {});
};