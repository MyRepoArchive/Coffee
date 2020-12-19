const chatOrDm = require("./chatOrDm");

module.exports = (pages, permissions, message) => {
  chatOrDm({ embed: pages[0] }, permissions, message).then(async mess => {
    await mess.react('➡️').catch(() => {});
    await mess.react('⬅️').catch(() => {});
    await mess.react('⏩').catch(() => {});
    await mess.react('⏪').catch(() => {});
    let page = 1;

    mess.createReactionCollector((reaction, user) => user.id === message.author.id && (
      reaction.emoji.name === '➡️' || 
      reaction.emoji.name === '⬅️' ||
      reaction.emoji.name === '⏩' ||
      reaction.emoji.name === '⏪'
    ), 
    { time: 300000 }).on('collect', (reaction, user) => {
      reaction.users.remove(user.id).catch(() => {});

      if (reaction.emoji.name === '➡️') {
        if (page > pages.length - 1) return;
        mess.edit({ embed: pages[page] });
        page++;

      } else if (reaction.emoji.name === '⬅️') {
        if (page - 2 < 0) return;
        mess.edit({ embed: pages[page - 2] });
        page--;

      } else if (reaction.emoji.name === '⏩') {
        mess.edit({ embed: pages[pages.length - 1] })
        page = pages.length;

      } else {
        mess.edit({ embed: pages[0] });
        page = 1;
      };
    });
  }, e => {})
}