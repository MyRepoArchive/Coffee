const moment = require('moment');
const client = require('../../../..');
const embedPagination = require('../../../../functions/embedPagination');

module.exports = (message, permissions) => {
  const reports = Object.values(client.db.cache.reports).filter(report => report.created_by === message.author.id);
  const formatReport = (report) => report.report.length > 1800 ? `${report.report.slice(0, 1800)}\`...\`` : report.report;

  const pages = reports.map((report, index) => {
    return {
      author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL()
      },
      color: message.member.displayHexColor,
      title: `Report **${report.id}**`,
      description: `> ${formatReport(report)}`,
      fields: [
        {
          name: '\u200b',
          value: `Status: **${report.status}**\n` +
            `\`${moment(report.created_timestamp).locale('pt-br').format('LLLL')}\``
        },
        {
          name: '\u200b',
          value: (`${index < reports.length - 1 ? '➡️ \`|\` Próximo\n⏩ \`|\` Ultimo\n' : ''}${index > 0 ? '⬅️ \`|\` Anterior\n⏪ \`|\` Primeiro' : ''}`) || '-'
        }
      ],
      timestamp: new Date(),
      footer: {
        text: `Página ${index + 1} de ${reports.length}`
      }
    };
  });

  embedPagination(pages, permissions, message);
};