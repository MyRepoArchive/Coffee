const cache = require('../../../utils/cache');

module.exports = (userId, serverId) => {
  if (cache.scores[serverId]) {
    cache.scores[serverId][userId] ? cache.scores[serverId][userId]++ : cache.scores[serverId][userId] = 1;
  } else {
    cache.scores[serverId] = {};
    cache.scores[serverId][userId] = 1;
  };
};