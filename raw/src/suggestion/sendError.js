const error = require('../../../src/functions/error');
const { static: { emoji } } = require('../../../src/utils/emojis.json');

module.exports = (e) => {
  error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível enviar a sugestão para o canal destinado!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  );
};