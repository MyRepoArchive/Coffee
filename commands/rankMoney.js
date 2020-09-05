const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "moneyrank",
  name2: "bankrank",
  name3: "rankdinheiro",
  name4: "rankccoins",
  name5: "ccoinsranks",
  name6: "mrank",
  name7: "topmoney",
  name8: "rankccoin",
  name9: "ccoinrank",
  name10: "dinheirorank",
  name11: "rankmoney",
  type: "Economia",
  description: `Veja quem está no topo do poder em **<:ccoin:750776561753522276>CCoins**!`,

  async execute(message, args, comando, client, prefix, connection) {
    const rankEmoji = [emojis.goldmedal, emojis.silvermedal, emojis.bronzemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal]
    const errorAlert = require('../utils/errorAlert.js')
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor(hex.goldenrod)
      .setTitle(`Esses são os users mais ricos de **<:${emojis.ccoin}>CCoins**!`)
      .setFooter(`Sistema de rankeamento ${client.user.username}`, client.user.displayAvatarURL())
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const rank = await require('../utils/getTopMoney.js').run(connection, message.author)
    if(rank.length === 0) this.execute(message, args, comando, client, prefix, connection)
    
    let desc = '';
    for(let i = 0; i < rank.length && i < 10; i++) {
      let user = client.users.cache.get(rank[i][0])
      if(!user) user = await client.users.fetch(rank[i][0])
      embed.addField(`<:${rankEmoji[i]}>\`${i+1}º\` **${user.username}**`, `\`|||\`        **<:${emojis.ccoin}>${rank[i][1]}**`)
    }
    errorAlert.run(message, client, embed, emojis.alertcircleamarelo)
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}