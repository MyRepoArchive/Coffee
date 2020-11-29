const correctName = require('./correctName');
const command = require('./command');

module.exports.isValid = (commands) => {
  if (Object.keys(commands).filter(name => !correctName(name)).length) return false;

  if (Object.values(commands).filter((cmd, index) => {
    const key = Object.keys(commands)[index];

    return !command.isValid(cmd, key);
  }).length) return false;
  return true;
};

module.exports.layout = {
  "string": "object"
};