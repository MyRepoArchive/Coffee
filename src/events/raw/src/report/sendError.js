const { static: { emoji } } = require('../../../../utils/emojis.json');
const error = require('../../../../functions/error');

module.exports = (e) => {
  error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível enviar o report para o canal destinado!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  );
};