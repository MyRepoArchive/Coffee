const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (e) => {
  const { error, apiError } = require('../../../../functions');

  error(
    `> ${emoji.emojicoffeeerro} Erro\n` +
    '> Houve um erro ao atualizar o status de uma suggestion!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${apiError(e)}"`
  );
};