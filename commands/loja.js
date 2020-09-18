const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "loja",
  aliases: ["shop", "compras", "shopping", "store"],
  type: "Economia",
  description: `Com esse comando você pode abrir a loja e ver todos os produtos que tem disponível na loja do bot.`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    // Verificação do Cooldown
    if (!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js')
    if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 30000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((30000 - parseInt(Date.now() - this.cooldown[message.author.id].timestamp)) / 1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 30000) {
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }

    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    if (!podeEnviarMsg && podeAddReactions) return message.react(emojis.alertcircleamarelo)
    if (!podeAddReactions && podeEnviarMsg) return message.channel.send(`<:${emojis.alertcircleamarelo}> Eu preciso da permissão de adicionar reações para poder executar esse comando!`)
    if (!podeEnviarMsg || !podeAddReactions) return;

    const emojiArray = [emojis.number0blue, emojis.number1blue, emojis.number2blue, emojis.number3blue, emojis.number4blue, emojis.number5blue, emojis.number6blue, emojis.number7blue, emojis.number8blue, emojis.number9blue, emojis.number10blue]
    const formatedTypes = {
      "score-style": "Estilos para o score"
    }

    const getStoreItems = await require('../utils/getProducts.js').getProducts(connection)
    const distinctTypes = [...new Set(getStoreItems.types)]

    let desc = '';
    const storeEmbed = new Discord.MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Selecione o tipo de produto que deseja comprar!`)
      .setTimestamp()
      .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
    for (let i = 0; i < distinctTypes.length; i++) {
      desc += `<:${emojiArray[i]}> \`|\` ${formatedTypes[distinctTypes[i]]}`
    }
    storeEmbed.setDescription(desc)
    const msg = await message.channel.send(storeEmbed)

    for (let i = 0; i < distinctTypes.length; i++) {
      msg.react(emojiArray[i])
    }

    // Coleta as reações do usuário
    const filter1 = (reaction, user) => user.id === message.author.id
    const collector1 = msg.createReactionCollector(filter1, { time: 300000 })
    collector1.on("collect", async (reaction, user) => {
      if (!reaction.me) return;

      const newEmbed = new Discord.MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
        
      if (emojiArray.includes(reaction.emoji.identifier) && reaction.message.embeds[0].title === 'Selecione o tipo de produto que deseja comprar!') {

        // Para caso o usuário tenha selecionado os estilos de score
        if (distinctTypes[emojiArray.indexOf(reaction.emoji.identifier)] === 'score-style') {
          const itensScoreStyles = getStoreItems.result.filter(x => x.type === distinctTypes[emojiArray.indexOf(reaction.emoji.identifier)])
          const primeiroItem = itensScoreStyles[0]

          newEmbed
            .setTitle(`Deseja comprar o estilo **${primeiroItem.name}**? (1/${itensScoreStyles.length})`)
            .setDescription(`<:${emojis.fastforward}> Próximo item\n<:${emojis.linebankbusinesscard}> Comprar estilo - <:${emojis.linecoinbitcoin}>**${primeiroItem.price}**\n<:${emojis.linebankcard}> Comprar estilo (global) - <:${emojis.linebitcoinmoney}>**${primeiroItem.global_price}**`)
            .setImage(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${primeiroItem.image_id}.png?raw=true`)

          msg.edit(newEmbed)
          msg.reactions.cache.filter(react => emojiArray.includes(react.emoji.identifier)).map(react => react.users.remove(client.user.id))
          msg.react(emojis.fastforward)
          msg.react(emojis.linebankbusinesscard)
          msg.react(emojis.linebankcard)

          const filter2 = (reaction, user) => user.id === message.author.id
          const collector2 = msg.createReactionCollector(filter2, { time: 300000 })
          collector2.on("collect", async (reaction, user) => {
            if (!reaction.me) return;

            if (reaction.emoji.identifier === emojis.fastforward && reaction.message.embeds[0].title.startsWith(`Deseja comprar o estilo`)) {
              const page = Number(reaction.message.embeds[0].title.split('(')[1].split('/')[0])
              const item = itensScoreStyles[page]

              const embedPage = new Discord.MessageEmbed()
                .setTitle(`Deseja comprar o estilo **${item.name}**? (${page + 1}/${itensScoreStyles.length})`)
                .setImage(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${item.image_id}.png?raw=true`)
              page + 1 >= itensScoreStyles.length ?
                embedPage.setDescription(`<:${emojis.rewind}> Item anterior\n<:${emojis.linebankbusinesscard}> Comprar estilo - <:${emojis.linecoinbitcoin}>**${item.price}**\n<:${emojis.linebankcard}> Comprar estilo (global) - <:${emojis.linebitcoinmoney}>**${item.global_price}**`) :
                embedPage.setDescription(`<:${emojis.fastforward}> Próximo item\n<:${emojis.rewind}> Item anterior\n<:${emojis.linebankbusinesscard}> Comprar estilo - <:${emojis.linecoinbitcoin}>**${item.price}**\n<:${emojis.linebankcard}> Comprar estilo (global) - <:${emojis.linebitcoinmoney}>**${item.global_price}**`)

              msg.edit(embedPage)

              if (page + 1 >= itensScoreStyles.length) msg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforward).users.remove(client.user.id)

              msg.react(emojis.rewind)
            } else if (reaction.emoji.identifier === emojis.rewind && reaction.message.embeds[0].title.startsWith(`Deseja comprar o estilo`)) {
              const page = Number(reaction.message.embeds[0].title.split('(')[1].split('/')[0])
              const item = itensScoreStyles[page - 2]

              const embedPage = new Discord.MessageEmbed()
                .setTitle(`Deseja comprar o estilo **${item.name}**? (${page - 1}/${itensScoreStyles.length})`)
                .setImage(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${item.image_id}.png?raw=true`)
              page - 1 <= 1 ?
                embedPage.setDescription(`<:${emojis.fastforward}> Próximo item\n<:${emojis.linebankbusinesscard}> Comprar estilo - <:${emojis.linecoinbitcoin}>**${item.price}**\n<:${emojis.linebankcard}> Comprar estilo (global) - <:${emojis.linebitcoinmoney}>**${item.global_price}**`) :
                embedPage.setDescription(`<:${emojis.fastforward}> Próximo item\n<:${emojis.rewind}> Item anterior\n<:${emojis.linebankbusinesscard}> Comprar estilo - <:${emojis.linecoinbitcoin}>**${item.price}**\n<:${emojis.linebankcard}> Comprar estilo (global) - <:${emojis.linebitcoinmoney}>**${item.global_price}**`)

              msg.edit(embedPage)

              if (page - 1 <= 1) msg.reactions.cache.find(react => react.emoji.identifier === emojis.rewind).users.remove(client.user.id)

              msg.react(emojis.fastforward)
            } else if (reaction.message.embeds[0].title.startsWith(`Deseja comprar o estilo`)) {
              const estiloName = reaction.message.embeds[0].title.split('**')[1]
              const estilo = itensScoreStyles.find(x => x.name === estiloName)

              const sucessBuyEmbed = new Discord.MessageEmbed()
                .setColor(hex.lightgrey)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
                .setTimestamp()
                .setTitle(`<:${emojis.circlecheckverde}> Compra realizada com sucesso! \`${estilo.name}\``)
                .setThumbnail(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${estilo.image_id}.png?raw=true`)

              if (reaction.emoji.identifier === emojis.linebankbusinesscard) {

                const authorMoney = await require('../utils/getMoney.js').getServerMoney(connection, message.author, message.guild)

                if (estilo.price > authorMoney) return run(message, client, `<:${emojis.alertcircleamarelo}> ${message.author}, você não possui <:${emojis.linecoinbitcoin}>CCoins o suficiente para comprar este estilo!`)

                connection.query(`Select productid from compras_locais where userid = '${message.author.id}' and serverid = '${message.guild.id}'`, (err, result) => {
                  if (err) throw err;
                  if (result.find(x => x.productid === estilo.id)) {
                    return run(message, client, `<:${emojis.alertcircleamarelo}> ${message.author}, você já possui este estilo neste servidor!`)
                  } else {
                    connection.query(`insert into compras_locais (userid, serverid, productid, momento_compra) values ('${message.author.id}', '${message.guild.id}', '${estilo.id}', '${message.createdTimestamp}')`)
                    connection.query(`update score_per_server set money = '${authorMoney - estilo.price}', score_style_em_uso = '${estilo.id}' where userid = '${message.author.id}' and serverid = '${message.guild.id}'`)

                    msg.edit(sucessBuyEmbed)
                  }
                })

              } else if (reaction.emoji.identifier === emojis.linebankcard) {

                const getMoney = await require('../utils/getMoney.js').getMoney(connection, message.author)
                const authorBankMoney  = getMoney.bankmoney

                if(estilo.global_price > authorBankMoney) return run(message, client, `<:${emojis.alertcircleamarelo}> ${message.author}, você não possui <:${emojis.linecoinbitcoin}>CCoins no banco o suficiente para comprar este estilo!`)

                connection.query(`Select productid from compras_globais where userid = '${message.author.id}'`, (err, result) => {
                  if(err) throw err;
                  if(result.find(x => x.productid === estilo.id)) {
                    return run(message, client, `<:${emojis.alertcircleamarelo}> ${message.author}, você já possui este estilo!`) 
                  } else {
                    connection.query(`insert into compras_globais (userid, productid, momento_compra) values ('${message.author.id}', '${estilo.id}', '${message.createdTimestamp}')`)
                    connection.query(`update users set bankmoney = '${authorBankMoney - estilo.global_price}', score_style_global_em_uso = '${estilo.id}' where iduser = '${message.author.id}'`)

                    msg.edit(sucessBuyEmbed)
                  }
                })
              }
            }
          })
        }
      }
    })
  }
}