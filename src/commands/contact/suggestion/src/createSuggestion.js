const { static: { emoji } } = require('../../../../utils/emojis.json');
const push = require('../../../../controllers/suggestions/push');
const client = require('../../../..');
const error = require('../../../../functions/error');

module.exports = (suggestion, userId) => new Promise((resolve, reject) => {
  if (!suggestion) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "createSuggestion" está sendo chamada sem o parâmetro "suggestion", que é essencial para o correto funcionamento da mesma.\n'+
      `> Path: "${__filename}"`
    );
    reject();
    return;
  };

  if (!userId) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "createSuggestion" está sendo chamada sem o parâmetro "userId", que é essencial para o correto funcionamento da mesma.\n'+
      `> Path: "${__filename}"`
    );
    reject();
    return;
  };

  if (typeof suggestion !== 'string' || typeof userId !== 'string') {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "createSuggestion" está sendo chamada com um dos parâmetros de um tipo não condizente ao que é necessário.\n'+
      `> Path: "${__filename}"\n`+
      `> Os parâmetros passados: { suggestion: ${suggestion}, userId: ${userId} }`
    );
    reject();
    return;
  };

  push([{ created_by: userId, suggestion }]).then(({ suggestions }) => {
    resolve(suggestions[client.db.cache.last_id]);
  }, e => {
    error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      '> Houve um erro ao tentar criar uma nova sugestão no banco de dados!\n' +
      `> Sugestão: "${suggestion}"\n` +
      `> O ID do usuário: "${userId}"\n`+
      `> Path: "${__filename}"\n` +
      `> Erro: "${e}"`
    );
    reject();
  });
});
