const client = require('../../../..');
const update = require('../../../../controllers/channels/update');

module.exports = (channelId, enable, all, allGuilds = false) => new Promise((resolve, reject) => {
  const obj = {};
  const guild = client.channels.cache.get(channelId).guild;
  const guildChannels = guild.channels.cache;
  const botChannels = client.channels.cache.filter(ch => ch.type !== 'dm');
  let channels = [];
  let defPerms;

  if (allGuilds) {
    channels.push(...Object.values(client.db.cache.channels));

    if (channels.length < botChannels.size) {
      botChannels.filter(channel => !channels.map(x => x.id).includes(channel.id)).forEach(channel => {
        obj[channel.id] = {
          calc_perm: 1,
          guild_id: channel.guild.id,
          id: channel.id
        };

        channels.push(obj[channel.id]);
      });
    };

    defPerms = channels.map(ch => ch.calc_perm);

    channels.forEach(channel => {
      obj[channel.id] = channel;
      obj[channel.id].calc_perm = enable ? 1 : 0;
    });
  } else if (all) {
    channels.push(...Object.values(client.db.cache.channels).filter(channel => channel.guild_id === guild.id));

    if (channels.length < guildChannels.size) {
      guildChannels.filter(channel => !channels.map(x => x.id).includes(channel.id)).forEach(channel => {
        obj[channel.id] = {
          calc_perm: 1,
          guild_id: guild.id,
          id: channel.id
        };

        channels.push(obj[channel.id]);
      });
    };

    defPerms = channels.map(ch => ch.calc_perm);

    channels.forEach(channel => {
      obj[channel.id] = channel;
      obj[channel.id].calc_perm = enable ? 1 : 0;
    });
  } else {
    obj[channelId] = client.db.cache.channels[channelId] || {
      calc_perm: 1,
      guild_id: client.channels.cache.get(channelId).guild.id,
      id: channelId
    };

    defPerms = [obj[channelId].calc_perm];
  
    obj[channelId].calc_perm = enable ? 1 : 0;

    channels.push(obj[channelId]);
  };

  channels = channels.filter((ch, index) => (enable ? 1 : 0) !== defPerms[index]);

  update(obj, { orCreate: true }).then(() => resolve(channels), e => reject(e));
});