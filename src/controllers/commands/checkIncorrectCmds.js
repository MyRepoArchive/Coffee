const filterIncorrectCmds = require("./filterIncorrectCmds");
const client = require('../..');
const isEquivalent = require("../../functions/isEquivalent");

module.exports = (commands, obs, ignore, reject) => {
  const incorrectCommands = filterIncorrectCmds(commands);

  if (incorrectCommands.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectCommands);
      obs.ignoredValues = [...new Set(obs.ignoredValues)];
      incorrectCommands.forEach((command) => {
        Object.values(commands).forEach(async (cmd) => {
          await isEquivalent(cmd, command[1]) ? 
          commands[command[0]] = client.db.cache.commands[command[0]] || null : 
          null
        });
      });
    } else {
      reject(new Error('Algum comando tem propriedades fora do padrão!'));
      return false;
    };
  };
  return true;
};