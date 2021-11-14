const Discord = require('discord.js');
const hex = require('../../colors.json');
const config = require('../../info.json');
const emojis = require('../../emojis.json');
const { welcomeChannels } = require('../utils/getWelcomeChannel');

module.exports = {
  name: "configwelcome",
  aliases: ["configurarwelcome", "configbemvindos", "configbemvindo", "configurarbemvindos", "configurarbemvindo", "configwelcomemessage", "configurarwelcomemessage", "alterarwelcomemessage"],
  type: "Configurações",
  description: `Use este comando para alterar a mensagens que é exibida quando algum novo membro entra no servidor.\n**OBS:** Você pode usar algumas palavras chaves para itens dinâmicos dentro do texto de boas-vindas, são elas:\n*\${name}* para exibir o nome aparente do membro novo\n*\${server}* para exibir o nome do servidor\n*\${tag}* para exibir a tag do membro que entrou\n*\${id}* para exibir o id do membro que acabou de entrar\n*\${memberCount}* para exibir a quantidade de membros atual do servidor\n*\${username}* para exibir o username do membro que entrou no servidor\n*\${status}* para exibir o status do membro que acabou de entrar no servidor`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    if (!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 60000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((60000 - parseInt(Date.now() - this.cooldown[message.author.id].timestamp)) / 1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if (this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 60000) {
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }

    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")

    if (!message.member.hasPermission("MANAGE_GUILD")) return run(message, client, `<:${emojis.slashred}> Você não têm permissão de gerenciar servidor para poder usar este comando!`, emojis.slashred)

    if (!podeEnviarMsg && podeAddReactions) return message.react(emojis.alertcircleamarelo)
    if (!podeAddReactions && podeEnviarMsg) return message.channel.send(`<:${emojis.alertcircleamarelo}> Eu preciso da permissão de adicionar reações para poder usar este comando!`)
    if (!podeEnviarMsg || !podeAddReactions) return;

    const configEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Selecione qual área da embed você deseja alterar`)
      .setDescription(`<:${emojis.number0blue}> Alterar título da embed\n<:${emojis.number1blue}> Alterar cor da embed\n<:${emojis.number2blue}> Alterar thumbnail da embed\n<:${emojis.number3blue}> Alterar descrição da embed\n<:${emojis.number4blue}> Alterar rodapé da embed\n<:${emojis.homecircle}> Voltar para a página inicial`)
      .setFooter(`Sistema de boas vindas ${client.user.username}`, client.user.displayAvatarURL())

    const msg = await message.channel.send(configEmbed)
    await msg.react(emojis.number0blue)
    await msg.react(emojis.number1blue)
    await msg.react(emojis.number2blue)
    await msg.react(emojis.number3blue)
    await msg.react(emojis.number4blue)
    await msg.react(emojis.homecircle)

    const reactionCollector = msg.createReactionCollector((reaction, user) => user.id === message.author.id, { time: 600000 })
    reactionCollector.on('collect', async (reaction, user) => {

      if (!reaction.me) return;

      if (reaction.emoji.identifier === emojis.homecircle) return msg.edit(configEmbed)

      if (reaction.emoji.identifier === emojis.number0blue) {
        const embedTitle = new Discord.MessageEmbed()
          .setTitle(`Digite abaixo qual deve ser o novo título da embed (até 150 caracteres)`)
          .setDescription(`Você tem 5 minutos para responder e pode usar as seguintes palavra-chaves para um texto dinâmico dentro da embed:\n*\${name}* para exibir o nome aparente do membro novo\n*\${server}* para exibir o nome do servidor\n*\${tag}* para exibir a tag do membro que entrou\n*\${id}* para exibir o id do membro que acabou de entrar\n*\${memberCount}* para exibir a quantidade de membros atual do servidor\n*\${username}* para exibir o username do membro que entrou no servidor\n*\${status}* para exibir o status do membro que acabou de entrar no servidor`)

        msg.edit(embedTitle)

        const collector = message.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { max: 1, time: 300000 })
        collector.on('collect', mensagem => {

          if (msg.embeds[0].title === 'Digite abaixo qual deve ser o novo título da embed (até 150 caracteres)') {
            connection.query(`update servers set welcome_title_embed = '${mensagem.content.slice(0, 150)}' where serverid = '${message.guild.id}'`)
            if(welcomeChannels[message.guild.id]) welcomeChannels[message.guild.id].welcome_title_embed = mensagem.content.slice(0, 150)

            message.channel.send(`<:${emojis.circlecheckverde}> Título da embed alterado com sucesso!`)
          }

        })

        collector.on('end', () => {
          msg.edit(configEmbed)
        })

        return
      }

      if (reaction.emoji.identifier === emojis.number1blue) {
        const embedColor = new Discord.MessageEmbed()
          .setTitle(`Digite abaixo a cor em hex que a embed deve ter (7 caracteres)`)
          .setDescription(`Você tem 2 minutos para responder`)

        msg.edit(embedColor)

        const collector = message.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { max: 1, time: 120000 })
        collector.on('collect', mensagem => {

          if (msg.embeds[0].title === `Digite abaixo a cor em hex que a embed deve ter (7 caracteres)`) {
            connection.query(`update servers set welcome_color_embed = '${message.content.slice(0, 7)}' where serverid = '${message.guild.id}'`)
            if(welcomeChannels[message.guild.id]) welcomeChannels[message.guild.id].welcome_color_embed = mensagem.content.slice(0, 7)

            message.channel.send(`<:${emojis.circlecheckverde}> Cor da embed alterado com sucesso!`)
          }

        })

        collector.on('end', () => {
          msg.edit(configEmbed)
        })

        return
      }

      if (reaction.emoji.identifier === emojis.number2blue) {
        const embedThumbnail = new Discord.MessageEmbed()
          .setTitle(`Coloque abaixo a URL da imagem`)
          .setDescription(`Você tem 2 minutos para responder`)

        msg.edit(embedThumbnail)

        const collector = message.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { time: 120000, max: 1 })
        collector.on('collect', mensagem => {

          if (msg.embeds[0].title === `Coloque abaixo a URL da imagem`) {
            connection.query(`update servers set welcome_thumbnail_embed = '${message.content.slice(0, 512)}' where serverid = '${message.guild.id}'`)
            if(welcomeChannels[message.guild.id]) welcomeChannels[message.guild.id].welcome_thumbnail_embed = mensagem.content.slice(0, 512)

            message.channel.send(`<:${emojis.circlecheckverde}> Thumbnail alterada com sucesso!`)
          }

        })

        collector.on('end', () => {
          msg.edit(configEmbed)
        })

        return;
      }

      if(reaction.emoji.identifier === emojis.number3blue) {
        const embedDescription = new Discord.MessageEmbed()
          .setTitle(`Digite abaixo a descrição da mensagem (até 1600 caracteres)`)
          .setDescription(`Você tem 10 minutos para responder e pode usar as seguintes palavra-chaves para um texto dinâmico dentro da embed:\n*\${name}* para exibir o nome aparente do membro novo\n*\${server}* para exibir o nome do servidor\n*\${tag}* para exibir a tag do membro que entrou\n*\${id}* para exibir o id do membro que acabou de entrar\n*\${memberCount}* para exibir a quantidade de membros atual do servidor\n*\${username}* para exibir o username do membro que entrou no servidor\n*\${status}* para exibir o status do membro que acabou de entrar no servidor`)
    
        msg.edit(embedDescription)

        const collector = message.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { time: 600000, max: 1 })
        collector.on('collect', mensagem => {

          if(msg.embeds[0].title === `Digite abaixo a descrição da mensagem (até 1600 caracteres)`) {
            connection.query(`update servers set welcome_description_embed = '${message.content.slice(0, 1600)}' where serverid = '${message.guild.id}'`)
            if(welcomeChannels[message.guild.id]) welcomeChannels[message.guild.id].welcome_description_embed = mensagem.content.slice(0, 1600)

            message.channel.send(`<:${emojis.circlecheckverde}> Descrição alterada com sucesso!`)
          }

        })

        collector.on('end', () => {
          msg.edit(configEmbed)
        })

        return;
      }

      if(reaction.emoji.identifier === emojis.number4blue) {
        const embedFooter = new Discord.MessageEmbed()
          .setTitle(`Digite abaixo o rodapé da mensagem (até 150 caracteres)`)
          .setDescription(`Você tem 5 minutos para responder e pode usar as seguintes palavra-chaves para um texto dinâmico dentro da embed:\n*\${name}* para exibir o nome aparente do membro novo\n*\${server}* para exibir o nome do servidor\n*\${tag}* para exibir a tag do membro que entrou\n*\${id}* para exibir o id do membro que acabou de entrar\n*\${memberCount}* para exibir a quantidade de membros atual do servidor\n*\${username}* para exibir o username do membro que entrou no servidor\n*\${status}* para exibir o status do membro que acabou de entrar no servidor`)
      
        msg.edit(embedFooter)

        const collector = message.channel.createMessageCollector(mensagem => mensagem.author.id === message.author.id, { time: 300000, max: 1 })
        collector.on('collect', mensagem => {

          if(msg.embeds[0].title === `Digite abaixo o rodapé da mensagem (até 150 caracteres)`) {
            connection.query(`update servers set welcome_footer_embed = '${message.content.slice(0, 150)}' where serverid = '${message.guild.id}'`)
            if(welcomeChannels[message.guild.id]) welcomeChannels[message.guild.id].welcome_footer_embed = mensagem.content.slice(0, 150)

            message.channel.send(`<:${emojis.circlecheckverde}> Rodapé alterad com sucesso!`)
          }

        })

        collector.on('end', () => {
          msg.edit(configEmbed)
        })

        return;
      }
    })
  }
}