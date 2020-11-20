const notProvidedReport = require('./src/notProvidedReport');
const createReport = require('./src/createReport');
const reportError = require('./src/reportError');
const sendInReportsChannel = require('./src/sendInReportsChannel');
const feedbackUser = require('./src/feedbackUser');

module.exports = {
  config: require('./src/config'),

  async run({ message, args, prefix }) {
    const { verifyActiveCooldown } = require('../../../functions');
    const { active, reason_inactivity, cooldownControl, cooldown, times_limit } = this.config;

    // Faz duas verificações rápidas, antes de executar o comando em si.
    if (!verifyActiveCooldown(message, active, reason_inactivity, cooldownControl, cooldown, times_limit)) return;
    if (!args.length) return notProvidedReport(message, prefix);

    const reportContent = args.join(' ');
  
    createReport(reportContent, message.author.id) // Cria o report na API
      .then(response => {
        sendInReportsChannel(reportContent, message, response.created_timestamp, response.id); // Manda para o canal de analise de reports
        feedbackUser(response.status, message, response.id); // Envia uma resposta para o usuário que fez o report
      }, () => reportError(message)); // Se não criar, avisa o user e os admins
  }
};

