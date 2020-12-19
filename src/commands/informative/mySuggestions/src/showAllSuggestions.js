const moment = require('moment');
const chatOrDm = require("../../../../functions/chatOrDm");
const client = require('../../../..');
const embedPagination = require('../../../../functions/embedPagination');

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

  embedPagination(pages, permissions, message);
};