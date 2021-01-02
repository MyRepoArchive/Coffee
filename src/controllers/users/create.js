const client = require('../..');
const error = require('../../functions/error');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkUsersType = require('./checkUsersType');
const checkUserType = require('./checkUserType');
const checkKeys = require('../../functions/checkKeys');
const setDefaults = require('./setDefaults');
const checkIncorrectUsers = require('./checkIncorrectUsers');
const checkBannedUsers = require('./checkBannedUsers');

module.exports = (users, { ignore = false, orUpdate = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    updatedKeys: [],
    alreadyExisted: []
  };

  if (!checkUsersType(users, reject) || !checkBannedUsers(users, ignore, obs, reject) || !checkKeys(users, ignore, obs, reject) || !checkUserType(users, ignore, obs, reject)) return;

  setDefaults(users);

  if (!checkIncorrectUsers(users, ignore, obs, reject)) return;

  if (Object.keys(users).filter(key => client.db.cache.users[key]).length) {
    if (orUpdate) {
      obs.updatedKeys = Object.keys(users).filter(key => client.db.cache.users[key]);
    } else if (ignore) {
      obs.alreadyExisted = Object.keys(users).filter(key => client.db.cache.users[key]);
      obs.alreadyExisted.forEach(key => users[key] = client.db.cache.users[key])
    } else {
      return reject(new Error('Este usuário já existe!'));
    };
  };

  client.db.ref('users').update(users).then(() => {
    Object.values(users).forEach((user, index) => {
      const key = Object.keys(users)[index];

      client.db.cache.users[key] = user;
    });

    resolve({ users: client.db.cache.users, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais usuários!\n' +
    `> Path: "${__filename}"\n` +
    `> Usuários: ${JSON.stringify(users, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});