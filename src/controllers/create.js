const client = require("..");
const { pathToObject } = require("../functions");
const predefinedStructures = require("../utils/predefinedStructures");

module.exports = async (path, obj, force = false) => new Promise((resolve, reject) => {

  if (Object.keys(obj).filter(key => typeof key !== 'number' && typeof key !== 'string').length)
    return reject(new Error('A key da propriedade deve ser uma string ou um número!'));
  // Se chave conter algum algarismo que não seja de A a Z, a a z, 0 a 9 ou _ retorna um erro!  
  if (Object.keys(obj).filter(key => /\W/g.test(key + '')).length) 
    return reject(new Error('A chave não pode corresponder à seguinte Expressão /\\W/g'));

  if (Object.values(obj).filter(value => typeof value === "function" || typeof value === "symbol" || value === null || value === undefined).length)
    return reject(new Error('O valor não pode ser uma função, symbol, null ou undefined'));
  
  if (typeof path !== "string") 
    return reject(new Error('O path deve ser uma string!'));
  
  if (path.startsWith('/')) path = path.slice(1);
  if (path.endsWith('/')) path = path.slice(0, path.length - 1);

  if (/\.|$|#|\[|\]/g.test(path))
    return reject(new Error('Path\'s não podem corresponder à essa Expressão /\\.|$|#|\\[|\\]/g'));

  const cachePath = await pathToObject(path, client.db.cache);

  if (cachePath.result !== undefined)
    return reject(new Error('O valor que deseja criar já existe!'));
  
  if (cachePath.traject !== cachePath.fullTraject)
    return reject(new Error('Alguns dos caminhos pais não existem'));

  // Se value for um array, transforma em um objeto com chaves inteiras
  Object.values(obj).filter(value => typeof value === "object" && typeof value.length === "number").forEach(value => {
    const newValue = {};

    value.forEach((valor, index) => newValue[index] = valor);

    value = newValue;
  });
  
  if (predefinedStructures(path) && predefinedStructures(path).isValid(obj)) {
    client.db.ref(path).update(obj);

    createInCache();

    client.emit('createInDb', path, obj, force);

    resolve((await pathToObject(path, client.db.cache)).result);
  } else if (force) {
    client.db.ref(path).update(obj);

    createInCache();

    client.emit('createInDb', path, obj, force);

    resolve((await pathToObject(path, client.db.cache)).result);
  } else {
    reject(new Error('Não existe uma estrutura pre-definida para esses dados!'));
  }
 
  function createInCache() {
    Object.keys(obj).forEach(key => {
      const value = obj[key];

      eval(`client.db.cache${cachePath.traject}["${key}"] = ${JSON.stringify(value)}`);
    });
  };
});