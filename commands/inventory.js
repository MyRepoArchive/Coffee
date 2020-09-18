const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');

module.exports = {
  name: "inventory",
  aliases: ["inventário", "inventario", "myitens", "myitems", "meusitems", "meusitens", "meusprodutos", "myproducts", "inv"],
  type: "economia",
  description: `Veja todos os itens que você possui`,
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

    const getInventory = await require('../utils/getUserInventory.js').getUserInventory(connection, message.author, message.guild)

    let desc = '';
    const invEmbed = new Discord.MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Selecione o tipo de produto que deseja ver!`)
      .setTimestamp()
      .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
    for (let i = 0; i < getInventory.types.length; i++) {
      desc += `<:${emojiArray[i]}> \`|\` ${formatedTypes[getInventory.types[i]]}`
    }
    invEmbed.setDescription(desc)
    const msg = await message.channel.send(invEmbed)

    for (let i = 0; i < getInventory.types.length; i++) {
      msg.react(emojiArray[i])
    }

    const filter1 = (reaction, user) => user.id === message.author.id
    const collector1 = msg.createReactionCollector(filter1, { time: 300000 })
    collector1.on("collect", async (reaction, user) => {
      if (!reaction.me) return;

      const newEmbed = new Discord.MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())

      if (emojiArray.includes(reaction.emoji.identifier) && reaction.message.embeds[0].title === 'Selecione o tipo de produto que deseja ver!') {

        // Para caso o usuário tenha selecionado os estilos de score
        if (getInventory.types[emojiArray.indexOf(reaction.emoji.identifier)] === 'score-style') {
          const localItensScoreStyles = getInventory.localResult.filter(x => x.type === getInventory.types[emojiArray.indexOf(reaction.emoji.identifier)])
          const globalItensScoreStyles = getInventory.globalResult.filter(x => x.type === getInventory.types[emojiArray.indexOf(reaction.emoji.identifier)])
          const allItensScoreStyles = localItensScoreStyles
          globalItensScoreStyles.map(x =>  allItensScoreStyles.push(x))
          const distinctItensScoreStyles = []

          for(let i = 0; i < allItensScoreStyles.length; i++) {

            if(!distinctItensScoreStyles.find(x => x.name === allItensScoreStyles[i].name)) {

              distinctItensScoreStyles.push(allItensScoreStyles[i])

            }

          }

          const primeiroItem = distinctItensScoreStyles[0]

          newEmbed
            .setTitle(`Inventário de estilos: **${primeiroItem.name}** (1/${distinctItensScoreStyles.length})`)
            .setDescription(`<:${emojis.linechangedocument}> Voltar para design padrão\n<:${emojis.fastforward}> Próximo item\n${localItensScoreStyles.find(x => x.name === primeiroItem.name) ? `<:${emojis.linehomefolder}> Alterar para esse design no servidor` : ''}\n${globalItensScoreStyles.find(x => x.name === primeiroItem.name) ? `<:${emojis.linecompartilharpasta}> Alterar para esse desgin (global)` : ''}`)
            .setImage(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${primeiroItem.image_id}.png?raw=true`)

          msg.edit(newEmbed)
          msg.reactions.cache.filter(react => emojiArray.includes(react.emoji.identifier)).map(react => react.users.remove(client.user.id))
          msg.react(emojis.linechangedocument)
          msg.react(emojis.fastforward)
          msg.react(emojis.linehomefolder)
          msg.react(emojis.linecompartilharpasta)

          const filter2 = (reaction, user) => user.id === message.author.id
          const collector2 = msg.createReactionCollector(filter2, { time: 300000 })
          collector2.on("collect", async (reaction, user) => {

            if (!reaction.me) return;

            if (reaction.emoji.identifier === emojis.fastforward && reaction.message.embeds[0].title.startsWith(`Inventário de estilos:`)) {
              const page = Number(reaction.message.embeds[0].title.split('(')[1].split('/')[0])
              const item = distinctItensScoreStyles[page]

              const embedPage = new Discord.MessageEmbed()
                .setTitle(`Inventário de estilos: **${item.name}** (${page + 1}/${distinctItensScoreStyles.length})`)
                .setImage(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${item.image_id}.png?raw=true`)
              page + 1 >= distinctItensScoreStyles.length ?
                embedPage.setDescription(`<:${emojis.linechangedocument}> Voltar para design padrão\n<:${emojis.rewind}> Item anterior\n${localItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linehomefolder}> Alterar para esse design no servidor` : ''}\n${globalItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linecompartilharpasta}> Alterar para esse desgin (global)` : ''}`) :
                embedPage.setDescription(`<:${emojis.linechangedocument}> Voltar para design padrão\n<:${emojis.fastforward}> Próximo item\n<:${emojis.rewind}> Item anterior\n${localItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linehomefolder}> Alterar para esse design no servidor` : ''}\n${globalItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linecompartilharpasta}> Alterar para esse desgin (global)` : ''}`)

              msg.edit(embedPage)

              if (page + 1 >= distinctItensScoreStyles.length) msg.reactions.cache.find(react => react.emoji.identifier === emojis.fastforward).users.remove(client.user.id)

              msg.react(emojis.rewind)
            } else if (reaction.emoji.identifier === emojis.rewind && reaction.message.embeds[0].title.startsWith(`Inventário de estilos:`)) {
              const page = Number(reaction.message.embeds[0].title.split('(')[1].split('/')[0])
              const item = distinctItensScoreStyles[page - 2]

              const embedPage = new Discord.MessageEmbed()
                .setTitle(`Inventário de estilos: **${item.name}** (${page - 1}/${distinctItensScoreStyles.length})`)
                .setImage(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${item.image_id}.png?raw=true`)
              page - 1 <= 1 ?
                embedPage.setDescription(`<:${emojis.linechangedocument}> Voltar para design padrão\n<:${emojis.fastforward}> Próximo item\n${localItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linehomefolder}> Alterar para esse design no servidor` : ''}\n${globalItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linecompartilharpasta}> Alterar para esse desgin (global)` : ''}`) :
                embedPage.setDescription(`<:${emojis.linechangedocument}> Voltar para design padrão\n<:${emojis.fastforward}> Próximo item\n<:${emojis.rewind}> Item anterior\n${localItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linehomefolder}> Alterar para esse design no servidor` : ''}\n${globalItensScoreStyles.find(x => x.name === item.name) ? `<:${emojis.linecompartilharpasta}> Alterar para esse desgin (global)` : ''}`)

              msg.edit(embedPage)

              if (page - 1 <= 1) msg.reactions.cache.find(react => react.emoji.identifier === emojis.rewind).users.remove(client.user.id)

              msg.react(emojis.fastforward)
            } else if (reaction.message.embeds[0].title.startsWith(`Inventário de estilos:`)) {
              const estiloName = reaction.message.embeds[0].title.split('**')[1]
              const estilo = distinctItensScoreStyles.find(x => x.name === estiloName)

              const sucessAlterEmbed = new Discord.MessageEmbed()
                .setColor(hex.lightgrey)
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setFooter(`Sistema de economia ${client.user.username}`, client.user.displayAvatarURL())
                .setTimestamp()
                .setTitle(`<:${emojis.circlecheckverde}> Mudança realizada com sucesso! \`${estilo.name}\``)
                .setThumbnail(`https://github.com/JoaoSCoelho/Coffe/blob/master/image/profile-v4-${estilo.image_id}.png?raw=true`)

              if (reaction.emoji.identifier === emojis.linehomefolder) {

                if(localItensScoreStyles.find(x => x.name === estiloName)) {

                  connection.query(`update score_per_server set score_style_em_uso = '${estilo.id}' where userid = '${message.author.id}' and serverid = '${message.guild.id}'`)

                  msg.edit(sucessAlterEmbed)
                
                } else {

                  run(message, client, `<:${emojis.xcirclered}> Você não possui esse estilo de maneira local, apenas de maneira global`, emojis.xcirclered)

                }

              } else if (reaction.emoji.identifier === emojis.linecompartilharpasta) {

                if(globalItensScoreStyles.find(x => x.name === estiloName)) {

                  connection.query(`update users set score_style_global_em_uso = '${estilo.id}' where iduser = '${message.author.id}'`)
  
                  msg.edit(sucessAlterEmbed)

                } else {

                  run(message, client, `<:${emojis.xcirclered}> Você não possui esse estilo de maneira global, apenas de maneira local`, emojis.xcirclered)

                }

              } else if(reaction.emoji.identifier === emojis.linechangedocument) {

                connection.query(`update users set score_style_global_em_uso = '0' where iduser = '${message.author.id}'`)
                connection.query(`update score_per_server set score_style_em_uso = '0' where userid = '${message.author.id}' and serverid = '${message.guild.id}'`)

                sucessAlterEmbed.setTitle(`<:${emojis.circlecheckverde}> Seu estilo foi resetado com sucesso!`)
                msg.edit(sucessAlterEmbed)

              }
            }
          })
        }
      }
    })
  }
}