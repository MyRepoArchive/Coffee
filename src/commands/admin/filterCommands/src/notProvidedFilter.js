const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (permissions, message) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> Você deve passar a chave de filtragem como parâmetro do comando.\n` +
    `> Chaves: ACTIVE, INACTIVE, WITH_IMAGE, WITHOUT_IMAGE`;

  chatOrDm(msg, permissions, message).catch(() => {});
}