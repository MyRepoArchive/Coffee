module.exports = (user, content) => {
  return {
    author: {
      displayAvatarURL: user.displayAvatarURL(),
      username: user.username,
      tag: user.tag,
      id: user.id,
      bot: user.bot,
    },
    createdTimestamp: Date.now(),
    content: content,
  }
};