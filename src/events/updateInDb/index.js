const { logger } = require("../../functions");
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (path, obj, force) => {
  logger(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Alguns itens foram atualizados no database\n' +
    `> Path: "${__filename}"\n` +
    `> Local: "${path}"\n` +
    `> Force: ${force}\n` +
    `> Objeto: ${JSON.stringify(obj, null, 2)}`
  );
};