const _user = require('./user')

module.exports.isValid = (guild) => {
  if ( 
    guild === undefined || 
    guild === null ||
    typeof guild !== "object" ||
    typeof guild.length !== "undefined" ||
    Object.keys(guild).filter(key => !/^\d+$/g.test(key + '') || key === '').length ||
    Object.values(guild).filter(user => !_user.isValid(user)).length
  ) return false;
  return true;
};

module.exports.layout = {
  "number": "object"
};