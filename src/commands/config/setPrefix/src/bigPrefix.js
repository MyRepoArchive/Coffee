const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (oldPrefix, permissions, message) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> O prefixo que está tentando setar tem mais de 10 caracteres!\n` +
    `> Use ${oldPrefix}ajuda setprefix para saber mais sobre como utilizar o comando!`

  chatOrDm(msg, permissions, message);
};