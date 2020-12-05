const verifyActive = require("./verifyActive");
const verifyCooldown = require("./verifyCooldown");

module.exports = (message, active, reason_inactivity, cooldownControl, cooldown, times_limit) => {
  if (!verifyActive(active, message, reason_inactivity)) return false;
  if (!verifyCooldown(message, cooldownControl, cooldown, times_limit)) return false;

  return true;
};