const client = require('../..');
const { error } = require('../../functions');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (channels, { ignore = false, only = false }) => new Promise((resolve, reject) => {
  if (typeof channels !== "object" || channels.length !== undefined)
    return reject(new Error('O parâmetro "channels" deve ser um objeto'))

  if (Object.keys(channels).filter(key => /\D+/g.test(key + '')).length)
    return reject(new Error('A key da propriedade não pode corresponder à seguinte expressão: "/\\D+/g"'));

  if (Object.values(channels).filter(value => value === null || typeof value !== "object" || value.length !== undefined).length)
    return reject(new Error('O valor deve ser um objeto!'));

  if (Object.values(channels).filter((channel) => (
    channel === null ||
    channel === undefined ||
    typeof channel !== "object" ||
    channel.length !== undefined
  )).length) return reject(new Error('Cada canal deve ser um objeto!'));

  Object.values(channels).forEach((channel, index) => {
    const key = Object.keys(channels)[index];

    if (channel.calc_perm === undefined || channel.calc_perm === null) channel.calc_perm = 1;
    if (!channel.id) channel.id = `${key}`;

    channels[index] = channel;
  });

  if (Object.values(channels).filter((channel, index) => {
    const key = Object.keys(channels)[index];

    return (
      typeof channel.calc_perm !== "number" ||
      typeof channel.guild_id !== "string" ||
      channel.guild_id === '' ||
      /\D+/g.test(channel.guild_id) ||
      typeof channel.id !== 'string' ||
      channel.id !== `${key}` 
    );
  }).length) return reject(new Error('Algum canal tem propriedades fora do padrão!'));

  if (Object.keys(channels).filter(key => client.db.cache.channels[key]).length && !ignore) 
    return reject(new Error('Este canal já existe!'));

  client.db.ref('channels').update(channels).then(() => {
    if (!only) {
      Object.values(channels).forEach((channel, index) => {
        const key = Object.keys(channels)[index];

        if (!client.db.cache.prefixes.find(channel => channel.guild_id === key)) {
          const guild = client.guilds.cache.get(key);
          
          if (guild) {
            const obj = {};

            guild.channels.cache.forEach(channel => {
              obj[channel.id] = {
                calc_perm: 1,
                guild_id: guild.id,
                id: channel.id
              };
            });

            if (Object.keys(obj).length) channelsCreate
          }
        }
      });
    };

    Object.values(channels).forEach((channel, index) => {
      const key = Object.keys(channels)[index];

      client.db.cache.channels[key] = channel;
    });

    resolve(client.db.cache.channels);
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais canais!\n' +
    `> Path: "${__filename}"\n` +
    `> Canais: ${JSON.stringify(channels, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});