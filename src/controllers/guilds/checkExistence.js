const client = require("../..");
const { error } = require("../../functions");
const channelsCreate = require('../channels/create');
const prefixCreate = require('../prefixes/create');
const membersCreate = require('../members/create');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (guildIds, { onlyCheck = false }) => {
  const response = {};
  const createObjChannels = {};
  const createObjPrefixes = {};
  const createObjMembers = {};

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

    if (Object.values(client.db.cache.members).filter(member => member.guild_id === guildId).length !== guild.members.cache.size) {
      if (!onlyCheck) {
        const nonDbMembers = guild.members.cache.filter(member => !Object.keys(client.db.cache.members).includes(`${guildId}-${member.id}`));

        nonDbMembers.forEach(member => createObjMembers[`${guildId}-${member.id}`] = {})
      };

      response[guildId].members = false;
    } else response[guildId].members = true;
  });

  if (Object.keys(createObjChannels).length) channelsCreate(createObjChannels, { only: true }).catch(e => genErrorResponse('canais', e));
  if (Object.keys(createObjPrefixes).length) prefixCreate(createObjPrefixes, { only: true }).catch(e => genErrorResponse('prefixos', e));
  if (Object.keys(createObjMembers).length) membersCreate(createObjMembers, { only: true }).catch(e => genErrorResponse('membros', e));

  return response;

  function genErrorResponse(prop, e) {
    error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao criar ${prop} no banco de dados!\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 2)}"`
    );
  };
};