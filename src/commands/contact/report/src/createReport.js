const { static: { emoji } } = require('../../../../utils/emojis.json');
const push = require('../../../../controllers/reports/push');
const client = require('../../../..');
const error = require('../../../../functions/error');

module.exports = (report, userId) => new Promise((resolve, reject) => {
  if (!report) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "createReport" está sendo chamada sem o parâmetro "report", que é essencial para o correto funcionamento da mesma.\n'+
      `> Path: "${__filename}"`
    );
    reject();
    return;
  };

  if (!userId) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "createReport" está sendo chamada sem o parâmetro "userId", que é essencial para o correto funcionamento da mesma.\n'+
      `> Path: "${__filename}"`
    );
    reject();
    return;
  };

  if (typeof report !== 'string' || typeof userId !== 'string') {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "createReport" está sendo chamada com um dos parâmetros de um tipo não condizente ao que é necessário.\n'+
      `> Path: "${__filename}"\n`+
      `> Os parâmetros passados: { report: ${report}, userId: ${userId} }`
    );
    reject();
    return;
  };

  push([{ created_by: userId, report }]).then(reports => {
    resolve(reports[client.db.cache.last_id]);
  }, e => {
    error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      '> Houve um erro ao tentar criar um novo report no banco de dados!\n' +
      `> Report: "${report}"\n` +
      `> O ID do usuário: "${userId}"\n`+
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 2)}"`
    );
    reject();
  });
});
