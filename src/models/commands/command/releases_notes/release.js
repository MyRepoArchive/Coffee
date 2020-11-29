module.exports.isValid = (release) => {
  if (
    release !== null && (
      typeof release !== "object" ||
      typeof release.length !== "undefined" ||
      typeof release.name !== "string" ||
      typeof release.description !== "string" ||
      typeof release.timestamp !== "number"
    )
  ) return false;
  return true;
};

module.exports.layout = {
  name: "string",
  description: "string",
  timestamp: "number"
};