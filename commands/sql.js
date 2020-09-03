const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');

module.exports = {
  name: "sql",
  name2: "mysql",
  name3: "mysqlquery",
  name4: "sqlquery",
  type: "Dev commands",
  description: "Realize uma query MySQL diretamente do discord!",

  async execute(message, args, comando, client, prefix, connection) {
    const errorAlert = require('../utils/errorAlert.js')
    const sql = args.join(' ')
    const sqlEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de ajuda em desenvolvimento ${client.user.username}`, client.user.displayAvatarURL())
    if(message.author.id !== config.owner) return errorAlert.run(message, client, `<:slashred:747879954305253468> Você não pode usar esse tipo de comando!`, 'slashred:747879954305253468')
    if(!sql) return errorAlert.run(message, client, `<:alertcircleamarelo:747879938207514645> Insira um valor válido!`, 'alertcircleamarelo:747879938207514645')
    connection.query(sql, (err, result) => {
      if(err) {
        sqlEmbed.setColor(hex.orangered)
        sqlEmbed.setDescription(`\`\`\`${err}\`\`\``)
        errorAlert.run(message, client, sqlEmbed, 'alertcircleamarelo:747879938207514645')
        return;
      }
      sqlEmbed.setColor(hex.gray)
      sqlEmbed.setDescription(`\`\`\`${JSON.stringify(result).slice(0, 2020)}\`\`\``)
      errorAlert.run(message, client, sqlEmbed, 'alertcircleamarelo:747879938207514645')
    })
  }
}