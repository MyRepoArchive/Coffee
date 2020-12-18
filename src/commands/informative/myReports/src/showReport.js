const { MessageEmbed } = require("discord.js");
const client = require("../../../..");
const chatOrDm = require('../../../../functions/chatOrDm');
const showAllReports = require("./showAllReports");
const moment = require('moment')

module.exports = (message, reportId, permissions) => {
  const formatReport = (report) => report.report.length > 1800 ? `${report.report.slice(0, 1800)}\`...\`` : report.report;

  if (client.db.cache.reports[reportId] && client.db.cache.reports[reportId].created_by === message.author.id) {
    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Report **${reportId}**`)
      .setColor(message.member.displayHexColor)
      .setDescription(`> ${formatReport(client.db.cache.reports[reportId])}`)
      .addField('\u200b', 
        `Status: **${client.db.cache.reports[reportId].status}**\n` + 
        `\`${moment(client.db.cache.reports[reportId].created_timestamp).locale('pt-br').format('LLLL')}\``
      )
      .setTimestamp()

    chatOrDm(embed, permissions, message);
  } else showAllReports(message, permissions);
};