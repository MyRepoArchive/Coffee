const api = require('../../../../services/api');
const { apiAuthToken } = require('../../../../config/auth.json');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const { error } = require('../../../../functions');

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

  api.put('/reports/create', {
    report,
    createdBy: userId
  },
  {
    headers: {
      Authorization: `Bearer ${apiAuthToken}`,
    }
  })
  .then(res => resolve(res.data))
  .catch(e => {
    error(
    `> ${emoji.emojicoffeeerro} Erro!\n\n`+
    '> Houve um erro ao tentar criar um novo report na api!\n'+
    `> O report: "${report}"\n`+
    `> O ID do usuário: "${userId}"\n`+
    `> O Erro: "${e}"`
    );
    reject();
  });
});
