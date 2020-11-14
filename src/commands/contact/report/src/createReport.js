const api = require('../../../../services/api');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (report, userId) => new Promise((resolve, reject) => {
  const { error, apiError } = require('../../../../functions');
  const { apiAuthToken } = require('../../../../config/auth.json');

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

  api.put('/reports/create', { reports: [ { report, created_by: userId } ] })
    .then(res => {
      resolve(res.data.reports[0]);
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n`+
        '> Houve um erro ao tentar criar um novo report na api!\n'+
        `> O report: "${report}"\n`+
        `> O ID do usuário: "${userId}"\n`+
        `> Path: "${__filename}"\n` +
        `> O Erro: "${apiError(e)}"`
      );
      reject();
    });
});
