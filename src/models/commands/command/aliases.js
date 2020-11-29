const correctName = require("../correctName");

module.exports.isValid = (aliases) => {
  if (
    aliases !== null && (
      typeof aliases !== "object" ||
      typeof aliases.length !== "number" ||
      !correctName(aliases)
    )
  ) return false;
  return true;
};

module.exports.layout = [
  "string"
];