const client = require('../..');
const { error } = require('../../functions');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkCmdsType = require('./checkCmdsType');
const checkCmdType = require('./checkCmdType');
const checkIncorrectCmds = require('./checkIncorrectCmds');
const checkKeys = require('./checkKeys');
const setDefaults = require('./setDefaults');

module.exports = (commands, { ignore = false, orUpdate = false }) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    updatedKeys: [],
    alreadyExisted: []
  };

  if (!checkCmdsType(commands, reject) || !checkKeys(commands, ignore, obs, reject) || !checkCmdType(commands, ignore, obs, reject)) return;

  setDefaults(commands);

  if (!checkIncorrectCmds(commands, obs, ignore, reject)) return;

  if (Object.keys(commands).filter(key => client.db.cache.commands[key]).length)  {
    if (orUpdate) {
      obs.updatedKeys = Object.keys(commands).filter(key => client.db.cache.commands[key]);
    } else if (ignore) {
      obs.alreadyExisted = Object.keys(commands).filter(key => client.db.cache.commands[key]);
      obs.alreadyExisted.forEach(key => commands[key] = client.db.cache.commands[key]);
    } else {
      return reject(new Error('Este comando já existe!'));
    };
  };

  client.db.ref('commands').update(commands).then(() => {
    Object.values(commands).forEach((command, index) => {
      const key = Object.keys(commands)[index];

      client.db.cache.commands[key] = command;
    });

    resolve({ commands: client.db.cache.commands, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais comandos!\n' +
    `> Path: "${__filename}"\n` +
    `> Comandos: ${JSON.stringify(commands, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});