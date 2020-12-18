const moment = require('moment');
const chatOrDm = require("../../../../functions/chatOrDm");
const client = require('../../../..');

module.exports = (message, permissions) => {
  const suggestions = Object.values(client.db.cache.suggestions).filter(suggestion => suggestion.created_by === message.author.id);
  const formatSuggestion = (suggestion) => suggestion.suggestion.length > 1800 ? `${suggestion.suggestion.slice(0, 1800)}\`...\`` : suggestion.suggestion;

  const pages = suggestions.map((suggestion, index) => {
    return {
      author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL()
      },
      color: message.member.displayHexColor,
      title: `Sugestão **${suggestion.id}**`,
      description: `> ${formatSuggestion(suggestion)}`,
      fields: [
        {
          name: '\u200b',
          value: `Status: **${suggestion.status}**\n` +
            `\`${moment(suggestion.created_timestamp).locale('pt-br').format('LLLL')}\``
        },
        {
          name: '\u200b',
          value: (`${index < suggestions.length - 1 ? '➡️ \`|\` Próximo\n⏩ \`|\` Ultimo\n' : ''}${index > 0 ? '⬅️ \`|\` Anterior\n⏪ \`|\` Primeiro' : ''}`) || '-'
        }
      ],
      timestamp: new Date(),
      footer: {
        text: `Página ${index + 1} de ${suggestions.length}`
      }
    };
  });

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
};