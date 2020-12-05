module.exports = (channels) => {
  Object.values(channels).forEach((channel, index) => {
    if (channel === null) return;

    const key = Object.keys(channels)[index];

    if (channel.calc_perm === undefined || channel.calc_perm === null) channel.calc_perm = 1;
    if (!channel.id) channel.id = `${key}`;

    channels[key] = channel;
  });
};