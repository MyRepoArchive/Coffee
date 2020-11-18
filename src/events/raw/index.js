const client = require('../..');
const { report_analise, report_aprovados, admins } = require('../../config/default.json');
const reportAnalyzer = require('./src/reportAnalyzer');
const reportSolver = require('./src/reportSolver');

module.exports = async (data) => {

  if (data.t === 'MESSAGE_REACTION_ADD' && data.d.user_id !== client.user.id && admins.includes(data.d.user_id)) {
    if (data.d.channel_id === report_analise) reportAnalyzer(data);
    if (data.d.channel_id === report_aprovados) reportSolver(data);
  };
};