const client = require('../..');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkChannelsType = require('./checkChannelsType');
const checkBannedGuilds = require('./checkBannedGuilds');
const checkChannelType = require('./checkChannelType');
const checkKeys = require('../../functions/checkKeys');
const setDefaults = require('./setDefaults');
const checkIncorrectChannels = require('./checkIncorrectChannels');
const checkExistence = require('../guilds/checkExistence');
const error = require('../../functions/error');

module.exports = (channels, { ignore = false, only = false, orUpdate = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    updatedKeys: [],
    alreadyExisted: []
  };

  if (!checkChannelsType(channels, reject) || !checkBannedGuilds(channels, ignore, obs, reject) || !checkKeys(channels, ignore, obs, reject) || !checkChannelType(channels, ignore, obs, reject)) return;

  setDefaults(channels);

  if (!checkIncorrectChannels(channels, ignore, obs, reject)) return;

  if (Object.keys(channels).filter(key => client.db.cache.channels[key]).length) {
    if (orUpdate) {
      obs.updatedKeys = Object.keys(channels).filter(key => client.db.cache.channels[key]);
    } else if (ignore) {
      obs.alreadyExisted = Object.keys(channels).filter(key => client.db.cache.channels[key]);
      obs.alreadyExisted.forEach(key => channels[key] = client.db.cache.channels[key])
    } else {
      return reject(new Error('Este canal já existe!'));
    };
  };

  client.db.ref('channels').update(channels).then(() => {
    Object.values(channels).forEach((channel, index) => {
      const key = Object.keys(channels)[index];

      client.db.cache.channels[key] = channel;
    });

    if (!only) checkExistence(Object.values(channels).map(channel => channel.guild_id), 'channels');

    resolve({ channels: client.db.cache.channels, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais canais!\n' +
    `> Path: "${__filename}"\n` +
    `> Canais: ${JSON.stringify(channels, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});