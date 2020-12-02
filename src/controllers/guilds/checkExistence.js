const client = require("../..");
const channelsCreate = require('../channels/create');
const prefixCreate = require('../prefixes/create');

module.exports = (guildIds, { onlyCheck = false }) => {
  const response = {};
  const createObjChannels = {};
  const createObjPrefixes = {};

  guildIds.filter(guildId => {
    const guild = client.guilds.cache.get(guildId);
    
    if (!guild) return response[guildId] = "Não existe";

    if (Object.values(client.db.cache.channels).filter(channel => channel.guild_id === guildId).length !== guild.channels.cache.size) {
      if (!onlyCheck) {
        const nonDbChannels = guild.channels.cache.filter(channel => !Object.keys(client.db.cache.channels).includes(channel.id));

        nonDbChannels.forEach(channel => createObjChannels[channel.id] = { calc_perm: 1, guild_id: guildId, id: channel.id });
      };

      response[guildId].channels = false;
    } else response[guildId].channels = true;
      
    if (!client.db.cache.prefixes[guildId]) {
      if (!onlyCheck) {
        createObjPrefixes[guildId] = null;
      };

      response[guildId].prefix = false;
    } else response[guildId].prefix = true;
  });

  if (Object.keys(createObjChannels).length) channelsCreate(createObjChannels, { only: true });
  if (Object.keys(createObjPrefixes).length) prefixCreate(createObjPrefixes, { only: true });

  return response;
};