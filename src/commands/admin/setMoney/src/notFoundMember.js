const chatOrDm = require('../../../../functions/chatOrDm');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (message, permissions, paramMember) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    `> Não foi possível encontrar nenhum membro com o parâmetro \`\`\`${paramMember}\`\`\``;

  chatOrDm(msg, permissions, message).catch(() => {});
};