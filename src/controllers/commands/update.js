const client = require('../..');
const { error } = require('../../functions');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkKeys = require('./checkKeys');
const checkCmdType = require('./checkCmdType');
const checkCmdsType = require('./checkCmdsType');
const setDefaults = require('./setDefaults');
const checkIncorrectCmds = require('./checkIncorrectCmds');

module.exports = (commands, { ignore = false, orCreate = false }) => new Promise((resolve, reject) => {
  const obs = {};

  if (!checkCmdsType(commands, reject) || !checkKeys(commands, ignore, obs, reject) || !checkCmdType(commands, ignore, obs, reject)) return;

  setDefaults(commands);

  if (!checkIncorrectCmds(commands, obs, ignore, reject)) return;

  if (Object.keys(commands).filter(key => !client.db.cache.commands[key]).length) {
    if (orCreate) {
      obs.createdKeys = Object.keys(commands).filter(key => !client.db.cache.commands[key]);
    } else if (ignore) {
      obs.nonExistent = Object.keys(commands).filter(key => !client.db.cache.commands[key]);
      obs.nonExistent.forEach(name => commands[key] = null);
    } else {
      return reject(new Error('Um dos comandos não existe!'));
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
    '> Houve um erro ao atualizar um ou mais comandos!\n' +
    `> Path: "${__filename}"\n` +
    `> Comandos: ${JSON.stringify(commands, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});