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
  description: `Veja quem está no topo do poder em **<:${emojis.ccoin}>CCoins**!`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const rankEmoji = [emojis.goldmedal, emojis.silvermedal, emojis.bronzemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal, emojis.bluemedal]
    const { run } = require('../utils/errorAlert.js')
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 10000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((10000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 10000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const podeAddReactions = message.channel.memberPermissions(message.guild.member(client.user.id)).has("ADD_REACTIONS")
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor(hex.goldenrod)
      .setTitle(`Esses são os users mais ricos de **<:${emojis.ccoin}>CCoins**!`)
      .setFooter(`Sistema de rankeamento ${client.user.username}`, client.user.displayAvatarURL())
    if(podeAddReactions) await message.react(emojis.carregando) // Reagi na mensagem com um emoji de loading
    const rank = await require('../utils/getTopMoney.js').run(connection, message.author)
    let desc = '';
    for(let i = 0; i < rank.length && i < 10; i++) {
      let user = client.users.cache.get(rank[i][0])
      if(!user) user = await client.users.fetch(rank[i][0])
      embed.addField(`<:${rankEmoji[i]}>\`${i+1}º\` **${user.username}**`, `\`|||\`        **<:${emojis.ccoin}>${rank[i][1]}**`)
    }
    run(message, client, embed, emojis.alertcircleamarelo)
    if(podeAddReactions) message.reactions.cache.find(react => react.users.cache.get(client.user.id).id === client.user.id).users.remove(client.user.id) // Remove o emoji de carregando
  }
}