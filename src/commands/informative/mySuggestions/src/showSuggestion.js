const { MessageEmbed } = require("discord.js");
const client = require("../../../..");
const chatOrDm = require('../../../../functions/chatOrDm');
const showAllSuggestions = require("./showAllSuggestions");
const moment = require('moment')

module.exports = (message, suggestionId, permissions) => {
  const formatSuggestion = (suggestion) => suggestion.suggestion.length > 1800 ? `${suggestion.suggestion.slice(0, 1800)}\`...\`` : suggestion.suggestion;

  if (client.db.cache.suggestions[suggestionId] && client.db.cache.suggestions[suggestionId].created_by === message.author.id) {
    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Sugestão **${suggestionId}**`)
      .setColor(message.member.displayHexColor)
      .setDescription(`> ${formatSuggestion(client.db.cache.suggestions[suggestionId])}`)
      .addField('\u200b', 
        `Status: **${client.db.cache.suggestions[suggestionId].status}**\n` + 
        `\`${moment(client.db.cache.suggestions[suggestionId].created_timestamp).locale('pt-br').format('LLLL')}\``
      )
      .setTimestamp()

    chatOrDm(embed, permissions, message);
  } else showAllSuggestions(message, permissions);
};