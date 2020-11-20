module.exports = (message, active, reason_inactivity, cooldownControl, cooldown, times_limit) => {
  const { verifyActive, verifyCooldown } = require('..');

  if (!verifyActive(active, message, reason_inactivity)) return false;
  if (!verifyCooldown(message, cooldownControl, cooldown, times_limit)) return false;

  return true;
};