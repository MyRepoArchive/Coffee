const { static: { emoji } } = require('../../utils/emojis.json');
const { error } = require('..')

module.exports = (e) => {
  error(
    `> ${emoji.emojicoffeeerro} Erro!\n\n`+
    '> Aconteceu um erro ao fazer uma requisição na api do bot!\n'+
    `> O erro: "${e}"`
  );
};