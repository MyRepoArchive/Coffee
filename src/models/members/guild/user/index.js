module.exports.isValid = (user) => {
  if (
    user === undefined ||
    user === null ||
    typeof user !== "object" ||
    typeof user.length !== "undefined" ||
    typeof user.created_timestamp !== "number" ||
    typeof user.guild_id !== "string" ||
    typeof user.money !== "number" ||
    typeof user.score !== "number" ||
    typeof user.user_id !== "string"
  ) return false;
  return true;
};

module.exports.layout = {
  created_timestamp: "number",
  guild_id: "string",
  money: "number",
  score: "number",
  user_id: "string"
};