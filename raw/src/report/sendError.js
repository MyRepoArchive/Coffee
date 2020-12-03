const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (e) => {
  const { error } = require('../../../../functions');

  error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível enviar o report para o canal destinado!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  );
};