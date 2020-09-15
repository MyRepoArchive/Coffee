const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');
const fs = require('fs')

module.exports = {
  name: "loja",
  aliases: ["shop", "compras", "shopping", "store"],
  type: "Economia",
  description: `Com esse comando você pode abrir a loja e ver todos os produtos que tem disponível na loja do bot.`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js')
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 10000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((10000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 10000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const getStoreItems = await require('../utils/getProducts.js').getProducts(connection)
    const storeEmbed = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
      for(let i = 0; i < getStoreItems.names.length; i++) {
        const name = getStoreItems.names[i]
        const desc = getStoreItems.descriptions[i]
        const price = getStoreItems.prices[i]
        
      }
      storeEmbed.setImage(`attachment://profile-v4-2.png`)
      const attach = new Discord.MessageAttachment(`./image/profile-v4-2.png`)
    message.channel.send({ files: [attach], embed: storeEmbed  })
  }
}