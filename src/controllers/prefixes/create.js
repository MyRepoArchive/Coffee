const client = require('../..');
const { error } = require('../../functions');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkExistence = require('../guilds/checkExistence');
const defaultPrefix = require('../../config/default.json').prefix;

module.exports = (prefixes, { ignore = false, only = false, orUpdate = false }) => new Promise((resolve, reject) => {
  const obs = {};

  if (typeof prefixes !== "object" || prefixes.length !== undefined)
    return reject(new Error('O parâmetro "prefixes" deve ser um objeto'));

  if (Object.keys(prefixes).filter(key => Object.keys(client.db.cache.banned_guilds).includes(key)).length) {
    if (ignore) {
      obs.ignoredKeys = Object.keys(prefixes).filter(key => Object.keys(client.db.cache.banned_guilds).includes(key));
      obs.ignoredKeys.forEach((guild_id) => prefixes[guild_id] = 0);
    } else {
      return reject(new Error('Um ou mais servidores estão na lista de banidos!'));
    };
  }

  if (Object.keys(prefixes).filter(key => /\D+/g.test(key + '')).length) {
    if (ignore) {
      obs.ignoredKeys.push(Object.keys(prefixes).filter(key => /\D+/g.test(key + '')));
      obs.ignoredKeys = [...new Set(obs.ignoredKeys)];
      obs.ignoredKeys.forEach((guild_id) => prefixes[guild_id] = 0);
    } else {
      return reject(new Error('A key da propriedade não pode corresponder à seguinte expressão: "/\\D+/g"'));
    };
  };

  Object.values(prefixes).forEach(prefix => prefix === undefined || prefix === null ? prefix = defaultPrefix : null)

  if (Object.values(prefixes).filter(value => typeof value !== "string" || value === '').length) {
    if (ignore) {
      obs.ignoredValues = Object.values(prefixes).map((prefix, index) => [Object.keys(prefixes)[index], prefix])
        .filter(value => typeof value[1] !== "string" || value[1] === '');

      Object.keys(prefixes).forEach(key => {
        if (Object.values(prefixes).filter(value => typeof value !== "string" || value === '').includes(prefixes[key])) prefixes[key] = null;
      });
    } else {
      return reject(new Error('O valor deve ser uma string!'));
    };
  };

  if (Object.keys(prefixes).filter(key => client.db.cache.prefixes[key]).length) {
    if (orUpdate) {
      obs.updatedKeys = [];
      Object.keys(prefixes).filter(key => client.db.cache.prefixes[key]).forEach(key => {
        if (obs.ignoredValues.map(x => x[0]).includes(key)) prefixes[key] = client.db.cache.prefixes[key];
        else obs.updatedKeys.push(key);
      })
    } else if (ignore) {
      obs.alreadyExisted = Object.keys(prefixes).filter(key => client.db.cache.prefixes[key]);
      obs.alreadyExisted.forEach(key => prefixes[key] = client.db.cache.prefixes[key]);
    } else {
      return reject(new Error('O prefixo deste servidor já existe!'));
    };
  };

  client.db.ref('prefixes').update(prefixes).then(() => {
    if (!only) checkExistence(Object.keys(prefixes))

    Object.values(prefixes).forEach((prefix, index) => {
      const key = Object.keys(prefixes)[index];

      client.db.cache.prefixes[key] = prefix;
    });

    resolve({ prefixes: client.db.cache.prefixes, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais prefixos dos servidores!\n' +
    `> Path: "${__filename}"\n` +
    `> Prefixos: ${JSON.stringify(prefixes, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));

});