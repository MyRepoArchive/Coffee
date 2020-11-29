const versionFilter = require("../versionFilter");
const release = require('./release');

module.exports.isValid = (rn) => {
  if (
    rn !== null && (
      typeof rn !== "object" ||
      typeof rn.length !== "undefined" ||
      Object.keys(rn).filter(versionFilter).length ||
      Object.values(rn).filter(rel => (
        !release.isValid(rel)
      )).length
    )
  ) return false;
  return true;
};

module.exports.layout = {
  "string": "object"
};