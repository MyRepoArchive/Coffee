const { isEquivalent } = require("../../functions");
const filterIncorrectCmds = require("./filterIncorrectCmds");

module.exports = (commands, obs, ignore, reject) => {
  const incorrectCommands = filterIncorrectCmds(commands);

  if (incorrectCommands.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectCommands);
      obs.ignoredValues = [...new Set(obs.ignoredValues)];
      incorrectCommands.forEach((command) => {
        Object.values(commands).forEach((cmd, index) => {
          const key = Object.keys(commands)[index];

          isEquivalent(cmd, command[1]) ? 
          commands[key] = client.db.cache.commands[key] || null : 
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