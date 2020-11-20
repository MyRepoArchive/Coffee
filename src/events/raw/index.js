const client = require('../..');
const { report_analise, report_aprovados, admins, suggestion_analise } = require('../../config/default.json');
const reportAnalyzer = require('./src/report/analyzer');
const reportSolver = require('./src/report/solver');
const suggestionAnalyzer = require('./src/suggestion/analyzer');

module.exports = async (data) => {

  if (data.t === 'MESSAGE_REACTION_ADD' && data.d.user_id !== client.user.id && admins.includes(data.d.user_id)) {
    if (data.d.channel_id === report_analise) reportAnalyzer(data);
    if (data.d.channel_id === report_aprovados) reportSolver(data);
    if (data.d.channel_id === suggestion_analise) suggestionAnalyzer(data);
  };
};