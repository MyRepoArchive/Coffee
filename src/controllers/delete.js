const predefinedStructures = require("../utils/predefinedStructures");
const client = require('..');
const { pathToObject } = require("../functions");

module.exports = (path, keys) => new Promise((resolve, reject) => {
  if (keys.filter(key => typeof key !== 'number' && typeof key !== 'string').length)
    return reject(new Error('A key da propriedade deve ser uma string ou um número!'));
  // Se chave conter algum algarismo que não seja de A a Z, a a z, 0 a 9 ou _ retorna um erro!  
  if (keys.filter(key => /\W/g.test(key + '')).length) 
    return reject(new Error('A chave não pode corresponder à seguinte Expressão /\\W/g'));
  
  if (typeof path !== "string") 
    return reject(new Error('O path deve ser uma string!'));
  
  if (path.startsWith('/')) path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, path.length - 1);

  if (/\.|$|#|\[|\]/g.test(path))
    return reject(new Error('Path\'s não podem corresponder à essa Expressão /\\.|$|#|\\[|\\]/g'));

  const cachePath = await pathToObject(path, client.db.cache);

  if (cachePath.result === undefined)
    return reject(new Error('O valor onde deseja deletar não existe!'));
  
  if (cachePath.traject !== cachePath.fullTraject)
    return reject(new Error('Alguns dos caminhos pais não existem'));

  if (keys.filter(async key => {
    const cachePathKey = await pathToObject(path + '/' + key, client.db.cache);

    return cachePathKey.traject === cachePathKey.fullTraject && cachePathKey.result === undefined;
  }).length) return reject(new Error('Um dos valores que deseja deletar não existe!'));

  const obj = {};

  keys.forEach(key => {
    obj[key] = null;
  });
  
  client.db.ref(path).update(obj).then(() => {
    deleteInCache();

    client.emit('deleteInDb', path, obj);

    resolve((await pathToObject(path, client.db.cache)).result);
  });
 
  function deleteInCache() {
    keys.forEach(key => {
      eval(`client.db.cache${cachePath.traject}["${key}"] = null`);
    });
  };
});