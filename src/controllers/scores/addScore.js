const scores = require('./scores');

module.exports = (userId, serverId) => {
  if (scores[`${serverId}-${userId}`]) {
    scores[`${serverId}-${userId}`]++
  } else {
    scores[`${serverId}-${userId}`] = 1;
  };
};