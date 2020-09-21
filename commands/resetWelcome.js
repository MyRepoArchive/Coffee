const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json');
const emojis = require('../emojis.json');
const { welcomeChannels } = require('../utils/getWelcomeChannel');

module.exports = {
  name: "resetwelcome",
  aliases: ["resetwelcomemessage", "resetarwelcome", "resetarwelcomemessage", "redefinirwelcome", "resetbemvindo", "resetarbemvindos", "redefinirbemvindos"],
  type: "Configurações",
  description: `Ao usar este comando todas as alterações que foram anteriormente atribuídas ao welcome message serão resetadas incluíndo o canal que era usado para enviar as mensagens. (todas as informações podem ser reatribuídas usando os comandos **configwelcome** e **setwelcome**)`,
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

    const msg = await message.channel.send(`<:${emojis.alertcircleamarelo}> ATENÇÃO! Esta ação resetará todas as informações que foram anteriormente atribuídas ao welcome message, incluindo o canal que era usado para enviar as mensagens. (todas as informações podem ser reatribuídas usando os comandos **configwelcome** e **setwelcome**)\n<:${emojis.circlecheckverde}> Confirmar ação em continuar`)
    await msg.react(emojis.circlecheckverde)

    const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id && reaction.emoji.identifier === emojis.circlecheckverde, { time: 30000, max: 1 })
    collector.on('collect', (reaction, user) => {
      if(!reaction.me) return;

      if(welcomeChannels[message.guild.id]) welcomeChannels[message.guild.id] = {
        welcome_channel: null,
        welcome_color_embed: null,
        welcome_title_embed: null,
        welcome_thumbnail_embed: null,
        welcome_description_embed: null,
        welcome_footer_embed: null,
      }
      connection.query(`update servers set welcome_channel = DEFAULT, welcome_title_embed = DEFAULT, welcome_color_embed = DEFAULT, welcome_thumbnail_embed = DEFAULT, welcome_description_embed = DEFAULT, welcome_footer_embed = DEFAULT where serverid = '${message.guild.id}'`)

      msg.edit(`<:${emojis.circlecheckverde}> Welcome resetado com sucesso!`)
    })

    collector.on('end', (collected, reason) => {
      if(reason === 'limit')return;

      msg.edit(`<:${emojis.xcirclered}> Não foi possível realizar esta ação!`)
    })
  }
}