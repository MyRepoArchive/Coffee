const client = require("../..");
const { isEquivalent } = require("../../functions");

module.exports = (channels, ignore, obs, reject) => {
  const incorrectChannels = Object.values(channels).map((channel, index) => [Object.keys(channels)[index], channel]).filter((channel, index) => {
    if (channel[1] === null) return;

    const key = Object.keys(channels)[index];

    return (
      typeof channel[1].calc_perm !== "number" ||
      typeof channel[1].guild_id !== "string" ||
      channel[1].guild_id === '' ||
      /\D+/g.test(channel[1].guild_id) ||
      typeof channel[1].id !== 'string' ||
      channel[1].id !== `${key}` 
    );
  });

  if (incorrectChannels.length) {
    if (ignore) {
      obs.ignoredValues.push(incorrectChannels);
      incorrectChannels.forEach(channel => {
        Object.values(channels).forEach(async (ch) => {
          await isEquivalent(channel[1], ch) ? 
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