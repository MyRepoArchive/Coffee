const client = require("../..");
const isEquivalent = require("../../functions/isEquivalent");

module.exports = (members, ignore, obs, reject) => {
  const incorrectMembers = Object.values(members).map((member, index) => [Object.keys(members)[index], member]).filter((member, index) => {
    if (member[1] === null) return;

    const key = member[0];

    return (
      typeof member[1].created_timestamp !== "number" ||
      typeof member[1].guild_id !== "string" ||
      member[1].guild_id === '' ||
      /\D+/g.test(member[1].guild_id) ||
      member[1].guild_id !== key.split('-')[0] ||
      typeof member[1].money !== "number" ||
      typeof member[1].score !== "number" ||
      typeof member[1].user_id !== 'string' ||
      /\D+/g.test(member[1].user_id) ||
      member[1].user_id !== key.split('-')[1]
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