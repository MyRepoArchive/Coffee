const client = require("../..");
const channelsCreate = require('../channels/create');
const prefixCreate = require('../prefixes/create');

module.exports = (guildIds, { onlyCheck = false }) => {
  const response = {};

  guildIds.filter(guildId => {
    const guild = client.guilds.cache.get(guildId);
    
    if (!guild) return response[guildId] = "Não existe";

    if (Object.values(client.db.cache.channels).filter(channel => channel.guild_id === guildId).length !== guild.channels.cache.size) {
      if (!onlyCheck) {
        const nonDbChannels = client.channels.cache.filter(channel => !Object.keys(client.db.cache.channels).includes(channel.id));
        const createObjChannels = {};

        nonDbChannels.forEach(channel => createObjChannels[channel.id] = { calc_perm: 1, guild_id: guildId, id: channel.id });

        channelsCreate(createObjChannels, false, true);
      };

      response[guildId].channels = false;
    } else response[guildId].channels = true;
      
    if (!client.db.cache.prefixes[guildId]) {
      if (!onlyCheck) {
        const createObjPrefixes = {};

        createObjPrefixes[guildId] = null;

        prefixCreate(createObjPrefixes, false, true);
      };

      response[guildId].prefix = false;
    } else response[guildId].prefix = true;
  });

  return response;
};