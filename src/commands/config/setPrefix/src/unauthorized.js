const { static: { emoji } } = require('../../../../utils/emojis.json');
const chatOrDm = require('../../../../functions/chatOrDm');

module.exports = (message, permissions) => {
  const msg = 
    `> ${emoji.emojicoffeeblock} Block!\n` +
    '> Você precisa da permissão de `GERENCIAR SERVIDOR` ou `ADMINISTRADOR` para conseguir usar este comando!';

  chatOrDm(msg, permissions, message);
};