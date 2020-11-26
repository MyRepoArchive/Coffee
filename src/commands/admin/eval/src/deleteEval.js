const { static: { emoji } } = require('../../../../utils/emojis.json')

module.exports = (msg) => {
  const { error } = require('../../../../functions');

  msg.edit(`> ${emoji.emojicoffeetrashrecycling} Deletado!`, { embed: null }).catch(e => error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n` +
    '> Não foi possível editar um eval, para deletá-lo!\n' +
    `> Path: "${__filename}"\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
};