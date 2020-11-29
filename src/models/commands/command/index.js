const aliases = require("./aliases");
const releases_notes = require("./releases_notes");
const versionFilter = require("./versionFilter");

module.exports.isValid = (command, key) => {
  if (
    command === null ||
    typeof command !== "object" ||
    typeof command.length !== "undefined" ||
    typeof command.active !== "boolean" ||
    !aliases.isValid(command.aliases) ||
    (command.cooldown !== null && typeof command.cooldown !== "number") ||
    typeof command.created_timestamp !== "number" ||
    (command.description !== null && typeof command.description !== "string") ||
    (command.example !== null && typeof command.example !== "string") ||
    (command.example_url !== null && typeof command.example_url !== "string") ||
    (command.reason_inactivity !== null && typeof command.reason_inactivity !== "string") ||
    (command.how_to_use !== null && typeof command.how_to_use !== "string") ||
    command.name !== key ||
    !releases_notes.isValid(command.releases_notes) ||
    (command.times_limit !== null && typeof command.times_limit !== "number") ||
    typeof command.type !== "string" ||
    typeof command.updated_timestamp !== "number" ||
    versionFilter(command.version)
  ) return false;
  return true;
};

module.exports.layout = {
  name: "string",
  aliases: "object",
  type: "string",
  description: 'string',
  how_to_use: 'string',
  example: 'string',
  example_url: 'string',
  cooldown: "number",
  times_limit: "number",
  active: "boolean",
  reason_inactivity: "string",
  created_timestamp: "number",
  updated_timestamp: "number",
  version: 'string',
  releases_notes: "object"
}