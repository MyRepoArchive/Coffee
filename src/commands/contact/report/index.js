const notProvidedReport = require('./src/notProvidedReport');
const createReport = require('./src/createReport');
const reportError = require('./src/reportError');
const sendInReportsChannel = require('./src/sendInReportsChannel');
const feedbackUser = require('./src/feedbackUser');

module.exports = {
  config: require('./src/config'),

  async run({ message, args, prefix }) {
    const { verifyCooldown, verifyActive } = require('../../../functions');
    if (!verifyActive(this.config.active, message, this.config.reasonInactivity)) return;
    if (!verifyCooldown(message, this.config.cooldownControl, this.config.cooldown, this.config.timesLimit)) return;

    if (!args.length) return notProvidedReport(message, prefix);

    const reportContent = args.join(' ');
  
    createReport(reportContent, message.author.id)
      .then(response => {
        sendInReportsChannel(reportContent, message, response.created_timestamp);
        feedbackUser(response.status, message);
      }, () => reportError(message));
  }
};

