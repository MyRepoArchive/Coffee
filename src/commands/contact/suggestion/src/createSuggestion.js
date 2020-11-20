const api = require('../../../../services/api');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (suggestion, userId) => new Promise((resolve, reject) => {
  const { error, apiError } = require('../../../../functions');

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

  api.put('/suggestions/create', { suggestions: [ { suggestion, created_by: userId } ] })
    .then(res => {
      resolve(res.data.suggestions[0]);
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n`+
        '> Houve um erro ao tentar criar um novo suggestion na api!\n'+
        `> O suggestion: "${suggestion}"\n`+
        `> O ID do usuário: "${userId}"\n`+
        `> Path: "${__filename}"\n` +
        `> O Erro: "${apiError(e)}"`
      );
      reject();
    });
});
