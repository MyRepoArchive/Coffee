const client = require('../..');
const error = require('../../functions/error');
const { static: { emoji } } = require('../../utils/emojis.json');
const checkMembersType = require('./checkMembersType');
const checkBannedGuilds = require('./checkBannedGuilds');
const checkMemberType = require('./checkMemberType');
const checkKeys = require('./checkKeys');
const setDefaults = require('./setDefaults');
const checkIncorrectMembers = require('./checkIncorrectMembers');
const checkExistence = require('../guilds/checkExistence');
const checkBannedUsers = require('./checkBannedUsers');

module.exports = (members, { ignore = false, only = false, orUpdate = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    updatedKeys: [],
    alreadyExisted: []
  };

  if (!checkMembersType(members, reject) || !checkBannedGuilds(members, ignore, obs, reject) || !checkBannedUsers(members, ignore, obs, reject) || !checkKeys(members, ignore, obs, reject) || !checkMemberType(members, ignore, obs, reject)) return;

  setDefaults(members);

  if (!checkIncorrectMembers(members, ignore, obs, reject)) return;

  if (Object.keys(members).filter(key => client.db.cache.members[key]).length) {
    if (orUpdate) {
      obs.updatedKeys = Object.keys(members).filter(key => client.db.cache.members[key]);
    } else if (ignore) {
      obs.alreadyExisted = Object.keys(members).filter(key => client.db.cache.members[key]);
      obs.alreadyExisted.forEach(key => members[key] = client.db.cache.members[key])
    } else {
      return reject(new Error('Este canal já existe!'));
    };
  };

  client.db.ref('members').update(members).then(() => {
    Object.values(members).forEach((member, index) => {
      const key = Object.keys(members)[index];

      client.db.cache.members[key] = member;
    });

    if (!only) checkExistence([...new Set(Object.values(members).map(member => member.guild_id))], 'members');

    resolve({ members: client.db.cache.members, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais membros!\n' +
    `> Path: "${__filename}"\n` +
    `> Membros: ${JSON.stringify(members, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});