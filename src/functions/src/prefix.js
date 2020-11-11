const { static: { emoji } } = require('../../utils/emojis.json');
const { prefix } = require('../../config/default.json');
const api = require('../../services/api');

module.exports = (guild) => new Promise((resolve) => {
  const { error, apiError, logger } = require('..');

  api.get(`/servers/${guild.id}`)
    .then(response => {
      if (response.data) {
        resolve(response.data.prefix);
      } else {
        resolve(prefix);
        api.put('/servers/create', { servers: [ { id: guild.id } ] })
          .then(response => logger(
            `> ${emoji.emojicoffeeinfo} Aviso!\n` +
            '> Um novo servidor foi criado no banco de dados!\n' +
            `> Servidor: ${response.data.servers}\n`
          ), e => error(
            `> ${emoji.emojicoffeeerro} Erro!\n`+
            '> Houve um erro ao criar um novo servidor na API!\n'+
            `> Servidor: "${guild.name}" \`${guild.id}\`\n`+
            `> Path: ${__filename}\n`+
            `> Erro: ${apiError(e)}`
          ));
      };
    }, e => {
      error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao buscar o prefix de um servidor na API!\n' +
        `> Servidor: "${guild.name}" \`${guild.id}\`\n` +
        `> Path: "${__filename}"\n` +
        `> Erro: "${apiError(e)}"`
      );
      resolve(prefix);
    });
});
