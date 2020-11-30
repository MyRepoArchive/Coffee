const _guild = require('./guild');

module.exports.isValid = (members) => {
  if (
    members === undefined ||
    members === null ||
    typeof members !== "object" ||
    typeof members.length !== "undefined" ||
    Object.keys(members).filter(key => !/^\d+$/g.test(key + '') || key === '').length ||
    Object.values(members).filter(guild => !_guild.isValid(guild)).length
  ) return false;
  return true;
};

module.exports.layout = {
  "number": "object"
};