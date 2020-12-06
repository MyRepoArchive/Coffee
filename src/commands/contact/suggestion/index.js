const createSuggestion = require('./src/createSuggestion');
const sendInSuggestionsChannel = require('./src/sendInSuggestionsChannel');
const feedbackUser = require('./src/feedbackUser');
const suggestionError = require('./src/suggestionError');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');

module.exports = {
  config: require('./src/config'),

  async run({ message, args, prefix }) {
    const { active, reason_inactivity, cooldownControl, cooldown, times_limit } = this.config;

    if (!verifyActiveCooldown(message, active, reason_inactivity, cooldownControl, cooldown, times_limit)) return;
    if (!args.length) return require('./src/notProvidedSuggestion')(message, prefix);

    const suggestionContent = args.join(' ');

    createSuggestion(suggestionContent, message.author.id)
      .then(response => {
        sendInSuggestionsChannel(suggestionContent, message, response.created_timestamp, response.id);
        feedbackUser(response.status, message, response.id);
      }, () => suggestionError(message));
  }
}