const { logger } = require("../../functions");
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (path, obj, force) => {
  logger(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Novos itens criados no banco de dados\n' +
    `> Path: "${__filename}"\n` +
    `> Local: "${path}"\n` +
    `> Force: ${force}\n` +
    `> Objeto: ${JSON.stringify(obj, null, 2)}`
  );
};