const notProvidedReport = require('./src/notProvidedReport');
const createReport = require('./src/createReport');
const reportError = require('./src/reportError');
const sendInReportsChannel = require('./src/sendInReportsChannel');
const feedbackUser = require('./src/feedbackUser');

module.exports = {
  config: require('./src/config'),

  async run({ message, args, prefix }) {
    const { verifyCooldown, verifyActive } = require('../../../functions');

    // Faz três verificações rápidas, antes de executar o comando em si.
    if (!verifyActive(this.config.active, message, this.config.reason_inactivity)) return;
    if (!verifyCooldown(message, this.config.cooldownControl, this.config.cooldown, this.config.times_limit)) return;
    if (!args.length) return notProvidedReport(message, prefix);

    const reportContent = args.join(' ');
  
    createReport(reportContent, message.author.id) // Cria o report na API
      .then(response => {
        sendInReportsChannel(reportContent, message, response.created_timestamp, response.id); // Manda para o canal de analise de reports
        feedbackUser(response.status, message); // Envia uma resposta para o usuário que fez o report
      }, () => reportError(message)); // Se não criar, avisa o user e os admins
  }
};

