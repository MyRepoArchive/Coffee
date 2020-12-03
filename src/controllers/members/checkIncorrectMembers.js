const client = require("../..");
const { isEquivalent } = require("../../functions");

module.exports = (members, ignore, obs, reject) => {
  const incorrectMembers = Object.values(members).map((member, index) => [Object.keys(members)[index], member]).filter((member, index) => {
    if (member === null) return;

    const key = Object.keys(members)[index];

    return (
      typeof member.created_timestamp !== "number" ||
      typeof member.guild_id !== "string" ||
      member.guild_id === '' ||
      /\D+/g.test(member.guild_id) ||
      member.guild_id !== key.split('-')[0] ||
      typeof member.money !== "number" ||
      typeof member.score !== "number" ||
      typeof member.user_id !== 'string' ||
      /\D+/g.test(member.user_id) ||
      member.user_id !== key.split('-')[1]
    );
  });

  if (incorrectMembers.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectMembers);
      incorrectMembers.forEach(member => {
        Object.values(members).forEach(async (mb) => {
          await isEquivalent(member[1], mb) ? 
          members[member[0]] = client.db.cache.members[member[0]] || null : 
          null;
        });
      });
    } else {
      reject(new Error('Algum membro tem propriedades fora do padrão!'));
      return false;
    };
  };
  return true;
};