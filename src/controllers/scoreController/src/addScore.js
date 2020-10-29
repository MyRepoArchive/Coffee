module.exports = (scores, userId, serverId) => {
  if (scores[serverId]) {
    scores[serverId][userId] ? scores[serverId][userId]++ : scores[serverId][userId] = 1;
  } else {
    scores[serverId] = {};
    scores[serverId][userId] = 1;
  };
};