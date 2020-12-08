const error = require('../../../../functions/error');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (e) => {
  error(
    `> ${emoji.emojicoffeeerro} Erro\n` +
    '> Houve um erro ao atualizar o status de um report!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${e}"`
  );
};