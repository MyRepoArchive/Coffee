const client = require("../..");
const checkKeys = require("./checkKeys");
const checkBannedGuilds = require("./checkBannedGuilds");
const checkIncorrectMembers = require("./checkIncorrectMembers");
const checkMembersType = require("./checkMembersType");
const checkMemberType = require("./checkMemberType");
const setDefaults = require("./setDefaults");
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require("../../functions/error");
const checkBannedUsers = require("./checkBannedUsers");
const checkExistence = require("../guilds/checkExistence");

module.exports = (members, { ignore = false, orCreate = false, only = false } = {}) => new Promise((resolve, reject) => {
  const obs = {
    ignoredValues: [],
    ignoredKeys: [],
    createdKeys: [],
    nonExistent: []
  };

  if (!checkMembersType(members, reject) || !checkBannedGuilds(members, ignore, obs, reject) || !checkBannedUsers(members, ignore, obs, reject) || !checkKeys(members, ignore, obs, reject) || !checkMemberType(members, ignore, obs, reject)) return;

  setDefaults(members);

  if (!checkIncorrectMembers(members, ignore, obs, reject)) return;

  if (Object.keys(members).filter(key => !client.db.cache.members[key]).length) {
    if (orCreate) {
      obs.createdKeys = Object.keys(members).filter(key => !client.db.cache.members[key]);
    } else if (ignore) {
      obs.nonExistent = Object.keys(members).filter(key => !client.db.cache.members[key]);
      obs.nonExistent.forEach(key => members[key] = null);
    } else {
      return reject(new Error('Um dos memberos não existe!'));
    };
  };

  client.db.ref('members').update(members).then(() => {
    Object.values(members).forEach((member, index) => {
      const key = Object.keys(members)[index];

      client.db.cache.members[key] = member;
    });

    if (!only) checkExistence(Object.values(members).map(member => member.guild_id), 'members');

    resolve({ members: client.db.cache.members, obs });
  }, e => error(
    `> ${emoji.emojicoffeeerro} Erro!\n` +
    '> Houve um erro ao criar um ou mais membros!\n' +
    `> Path: "${__filename}"\n` +
    `> Membros: ${JSON.stringify(members, null, 2)}\n` +
    `> Erro: "${JSON.stringify(e, null, 4)}"`
  ));
});