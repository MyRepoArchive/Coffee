const client = require('../..');
const error = require('../../functions/error');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkExistence = require('../guilds/checkExistence');
const checkBannedGuilds = require('./checkBannedGuilds');
const checkPrefixesType = require('./checkPrefixesType');
const checkKeys = require('./checkKeys');
const setDefault = require('./setDefault');
const checkPrefixType = require('./checkPrefixType');

module.exports = (prefixes, { ignore = false, only = false, orUpdate = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    updatedKeys: [],
    alreadyExisted: []
  };

  if (!checkPrefixesType(prefixes, reject) || !checkBannedGuilds(prefixes, ignore, obs, reject) || !checkKeys(prefixes, ignore, obs, reject)) return;

  setDefault(prefixes);

  if (!checkPrefixType(prefixes, ignore, obs, reject)) return;

  if (Object.keys(prefixes).filter(key => client.db.cache.prefixes[key]).length) {
    if (orUpdate) {
      obs.updatedKeys = Object.keys(prefixes).filter(key => client.db.cache.prefixes[key]);
    } else if (ignore) {
      obs.alreadyExisted = Object.keys(prefixes).filter(key => client.db.cache.prefixes[key]);
      obs.alreadyExisted.forEach(key => prefixes[key] = client.db.cache.prefixes[key]);
    } else {
      return reject(new Error('O prefixo deste servidor já existe!'));
    };
  };

  client.db.ref('prefixes').update(prefixes).then(() => {
    Object.values(prefixes).forEach((prefix, index) => {
      const key = Object.keys(prefixes)[index];

      client.db.cache.prefixes[key] = prefix;
    });

    if (!only) checkExistence(Object.keys(prefixes), 'prefixes');

    resolve({ prefixes: client.db.cache.prefixes, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais prefixos dos servidores!\n' +
    `> Path: "${__filename}"\n` +
    `> Prefixos: ${JSON.stringify(prefixes, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));

});