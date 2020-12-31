const client = require('../../..');
const showAllReports = require('./src/showAllReports');
const showReport = require('./src/showReport');
const { static: { emoji } } = require('../../../utils/emojis.json');
const chatOrDm = require('../../../functions/chatOrDm');

module.exports = {
  config: require('./src/config'),

  run({ message, args, permissions }) {
    const reportId = Number(args[0]);
    const reports = Object.values(client.db.cache.reports).filter(x => x.created_by === message.author.id);

    if (!reports.length) return chatOrDm(
      `> ${emoji.emojicoffeeinfo} Aviso\n` + 
      `> Você não possui nenhum report em nosso banco de dados.`,
    permissions, message);

    if (reportId) return showReport(message, reportId, permissions);

    showAllReports(message, permissions);
  }
}