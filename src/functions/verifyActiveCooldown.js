const verifyActive = require("./verifyActive");
const verifyCooldown = require("./verifyCooldown");

module.exports = (message, config) => {
  if (!verifyActive(config.active, message, config.reason_inactivity)) return false;
  if (!verifyCooldown(message, config.cooldownControl, config.cooldown, config.times_limit)) return false;

  return true;
};