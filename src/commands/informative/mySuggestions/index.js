const client = require('../../..');
const chatOrDm = require('../../../functions/chatOrDm');
const showAllSuggestions = require('./src/showAllSuggestions');
const showSuggestion = require('./src/showSuggestion');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = {
  config: require('./src/config'),

  run({ message, args, permissions }) {
    const suggestionId = Number(args[0]);
    const suggestions = Object.values(client.db.cache.suggestions).filter(x => x.created_by === message.author.id);

    if (!suggestions.length) return chatOrDm(
      `> ${emoji.emojicoffeeinfo} Aviso\n` + 
      `> Você não possui nenhuma sugestão em nosso banco de dados.`,
    permissions, message);

    if (suggestionId) return showSuggestion(message, suggestionId, permissions);

    showAllSuggestions(message, permissions);
  }
}