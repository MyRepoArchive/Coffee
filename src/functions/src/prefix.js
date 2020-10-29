const { static: { emoji } } = require('../../utils/emojis.json');
const { prefix } = require('../../config/default.json');
const api = require('../../services/api');

module.exports = (guild) => new Promise((resolve) => {
  const { error, apiError } = require('..');
  const { apiAuthToken } = require('../../config/auth.json');

  api.get(`/servers/${guild.id}`, { headers: { Authorization: `Bearer ${apiAuthToken}` } })
    .then(response => {
      if (response.data) {
        resolve(response.data.prefix);
      } else {
        resolve(prefix);
        api.put('/servers/create', { serverId: guild.id })
          .catch(e => error(
            `> ${emoji.emojicoffeeerro} Erro!\n`+
            '> Houve um erro ao criar um novo servidor na API!\n'+
            `> Servidor: "${guild.name}" \`${guild.id}\`\n`+
            `> Path: ${__filename}\n`+
            `> Erro: ${apiError(e)}`
          ));
      }
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
