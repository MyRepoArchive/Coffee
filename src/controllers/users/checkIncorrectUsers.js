const client = require("../..");
const isEquivalent = require("../../functions/isEquivalent");

module.exports = (users, ignore, obs, reject) => {
  const incorrectUsers = Object.entries(users).filter((user, index) => {
    if (user[1] === null) return;

    const key = user[0];

    return (
      typeof user[1].created_timestamp !== "number" ||
      typeof user[1].money !== "number" ||
      typeof user[1].id !== "string" ||
      /\D+/g.test(user[1].id) ||
      user[1].id !== key ||
      typeof user[1].admin !== "boolean" ||
      typeof user[1].consecutive_days !== "number" ||
      typeof user[1].daily_timestamp !== "number" ||
      typeof user[1].job !== "number" ||
      typeof user[1].money !== "number"
    );
  });

  if (incorrectUsers.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectUsers);
      incorrectUsers.forEach(user => {
        Object.values(users).forEach(async (usr) => {
          await isEquivalent(user[1], usr) ? 
          users[user[0]] = client.db.cache.users[user[0]] || null : 
          null;
        });
      });
    } else {
      reject(new Error('Algum usuário tem propriedades fora do padrão!'));
      return false;
    };
  };
  return true;
};