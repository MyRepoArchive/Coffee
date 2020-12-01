const client = require('..');
const { error } = require('../../functions');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (keys) => new Promise((resolve, reject) => {
  if (keys.filter(key => typeof key !== 'number').length)
    return reject(new Error('A key da propriedade deve ser um número!'));
  // Se chave conter algum algarismo que não seja de A a Z, a a z, 0 a 9 ou _ retorna um erro!  
  if (keys.filter(key => /\D+/g.test(key + '')).length)
    return reject(new Error('A chave não pode corresponder à seguinte Expressão /\\D+/g'));

  const obj = {};

  keys.forEach(key => {
    obj[key] = null;
  });
  
  client.db.ref('inventory').update(obj).then(() => {
    keys.forEach(key => client.db.cache.inventory[key] = null);

    resolve((await pathToObject(path, client.db.cache)).result);
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao deletar alguns itens do inventário!\n' +
    `> Path: "${__filename}"\n` +
    `> Keys: ${JSON.stringify(keys, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 2)}"`
  ));
});