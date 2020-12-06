module.exports = (cache) => {
  if (!cache.inventory) cache.inventory = {};
  if (!cache.activities) cache.activities = {};
  if (!cache.banned_guilds) cache.banned_guilds = {};
  if (!cache.banned_users) cache.banned_users = {};
  if (!cache.channels) cache.channels = {};
  if (!cache.commands) cache.commands = {};
  if (!cache.members) cache.members = {};
  if (!cache.prefixes) cache.prefixes = {};
  if (!cache.products) cache.products = {};
  if (!cache.reports) cache.reports = {};
  if (!cache.suggestions) cache.suggestions = {};
  if (!cache.users) cache.users = {};
};