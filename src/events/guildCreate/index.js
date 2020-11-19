const log = require('./src/log');
const api = require('../../services/api');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (guild) => {
  const { error, apiError } = require('../../functions');

  log(guild);

  api.put('/servers/create', { servers: [ { id: guild.id } ], ignore: true })
    .catch(e => error(
      `> ${emoji.emojicoffeeerro} Erro\n` +
      '> Houve um erro ao criar um novo servidor no banco de dados\n' +
      `> ID do server: "${guild.id}"\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${apiError(e)}"`
    ));

  const channels = guild.channels.cache.map(channel => ({ id: channel.id, server: guild.id }));

  api.put('/channels/create', { channels, ignore: true })
    .catch(e => error(
      `> ${emoji.emojicoffeeerro} Erro\n` +
      '> Houve um erro ao criar os canais de um servidor na API\n' +
      `> Canais: ${JSON.stringify(channels, null, 4)}\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${apiError(e)}"`
    ))
};