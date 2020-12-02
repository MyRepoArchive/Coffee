const client = require("../..");
const { isEquivalent } = require("../../functions");

module.exports = (channels, ignore, obs, reject) => {
  const incorrectChannels = Object.values(channels).map((channel, index) => [Object.keys(channels)[index], channel]).filter((channel, index) => {
    if (channel === null) return;

    const key = Object.keys(channels)[index];

    return (
      typeof channel.calc_perm !== "number" ||
      typeof channel.guild_id !== "string" ||
      channel.guild_id === '' ||
      /\D+/g.test(channel.guild_id) ||
      typeof channel.id !== 'string' ||
      channel.id !== `${key}` 
    );
  });

  if (incorrectChannels.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectChannels);
      incorrectChannels.forEach(channel => {
        Object.values(channels).forEach((ch) => {
          isEquivalent(channel[1], ch) ? 
          channels[channel[0]] = client.db.cache.channels[channel[0]] || null : 
          null;
        });
      });
    } else {
      reject(new Error('Algum canal tem propriedades fora do padrão!'));
      return false;
    };
  };
  return true;
};