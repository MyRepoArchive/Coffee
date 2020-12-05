const client = require('../..');
const error = require('../../functions/error');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (keys, { ignore = false, only = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredKeys: []
  };
  const obj = {};

  if (keys.filter(key => typeof key !== 'number').length) {
    if (ignore) {
      obs.ignoredKeys = keys.filter(key => typeof key !== 'number');
    } else {
      return reject(new Error('A key da propriedade deve ser um número!'));
    };
  };
  
  if (keys.filter(key => /\D+/g.test(key + '')).length) {
    if (ignore) {
      obs.ignoredKeys.push(keys.filter(key => /\D+/g.test(key + '')));
    } else {
      return reject(new Error('A chave não pode corresponder à seguinte Expressão /\\D+/g'));
    };
  };

  keys.forEach(key => {
    obj[key] = null;
  });
  
  client.db.ref('inventory').update(obj).then(() => {
    keys.forEach(key => client.db.cache.inventory[key] = null);

    resolve({ inventory: client.db.cache.inventory, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao deletar alguns itens do inventário!\n' +
    `> Path: "${__filename}"\n` +
    `> Keys: ${JSON.stringify(keys, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 2)}"`
  ));
});