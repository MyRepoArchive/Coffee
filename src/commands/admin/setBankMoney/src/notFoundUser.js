const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (message, permissions, paramUser) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> Não foi possível encontrar nenhum usuário com o parâmetro \`\`\`${paramUser}\`\`\``;

  chatOrDm(msg, permissions, message).catch(() => {});
};