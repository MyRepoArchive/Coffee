const { static: { emoji } } = require('../../utils/emojis.json');
const { error, apiError } = require('..');
const api = require('../../services/api');

module.exports = async (guild) => {
  return (
    await api.get(`/servers/${guild.id}`)
      .catch(e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao buscar o prefix de um servidor na API!\n' +
        `> ID do server: "${guild.id}"\n` +
        `> Erro: "${apiError(e)}"`
      )) ?
      (await api.get(`/servers/${guild.id}`)).data.prefix : '_'
  );
};
