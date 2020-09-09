const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "daily",
  name2: "moneydaily",
  name3: "work",
  name4: "trabalhar",
  type: "Economia",
  description: `Receba todos os dias seu dinheirinho, de acordo com o seu emprego atual!`,

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js')
    const dailyRes = await require('../utils/daily.js').daily(message, connection)
    if(dailyRes.tempoRestante) return run(message, client, `<:${emojis.dategearclock}> Você já trabalhou hoje! Aguarde mais **${parseInt(dailyRes.tempoRestante/3600000)} Horas e ${parseInt(dailyRes.tempoRestante%3600000/60000)} minutos** para poder trabalhar denovo!`, emojis.xcirclered)
    const embed = new Discord.MessageEmbed()
      .setColor(hex.gray)
      .setTitle(`<:${emojis.lineproject}> Emprego: **${dailyRes.nameEmprego}**`)
      .addField(`Você recebeu: <:${emojis.linecoinbitcoin}>**${dailyRes.recebido}**`, `Seus ganhos são entre: **<:${emojis.linecoinbitcoin}>${dailyRes.ganhoMin}** e **<:${emojis.linecoinbitcoin}>${dailyRes.ganhoMax}**\n\nVocê está trabalhando a **${dailyRes.diasConsecutivos}** dias consecutivos, trabalhe por **${dailyRes.diasParaUpar}** dias consecutivos para conseguir um novo emprego`)
      .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
      .setTimestamp()
    run(message, client, embed, emojis.alertcircleamarelo)
  }
}