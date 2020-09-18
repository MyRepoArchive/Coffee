const Discord = require('discord.js')
const hex = require('../colors.json')
const config = require('../info.json')
const emojis = require('../emojis.json')
const { channelsCache } = require('../utils/getChannelOptions')

module.exports = {
  name: "controlcalculator",
  aliases: ["controlcalc", "configcalculator", "configcalc"],
  type: "Configurações",
  description: `Com esse comando você pode escolher em qual(is) canal(is) o comando **calculator** deve funcionar, já que é um comando sem prefixo e pode em alguns casos atrapalhar uma conversa ou responder algo para o qual não foi chamado!`,
  cooldown: {},

  async execute(message, args, comando, client, prefix, connection) {
    const { run } = require('../utils/errorAlert.js') // Chama o arquivo que executa uma função de alerta!
    if(!message.member.hasPermission("ADMINISTRATOR") && !config.owners.includes(message.author.id)) return run(message, client, `<:${emojis.slashred}> Você não tem permissão para executar esse comando!`, emojis.slashred)
    if(!this.cooldown[message.author.id]) this.cooldown[message.author.id] = { vezes: 1, timestamp: message.createdTimestamp }
    if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp < 30000) {
      return run(message, client, `<:${emojis.datecronometro}> Aguarde ${parseInt((30000-parseInt(Date.now() - this.cooldown[message.author.id].timestamp))/1000)} segundos para usar este comando novamente!`, emojis.datecronometro)
    } else if(this.cooldown[message.author.id].vezes > 1 && Date.now() - this.cooldown[message.author.id].timestamp >= 30000){
      this.cooldown[message.author.id].vezes = 1
    }
    this.cooldown[message.author.id] = { vezes: this.cooldown[message.author.id].vezes + 1, timestamp: message.createdTimestamp }
    const podeEnviarMsg = message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")
    const podeAddReactions = message.channel.memberPermissions(message.guild.me).has("ADD_REACTIONS")
    const getCalcOptions = await require('../utils/getChannelOptions.js').getCacheCalc(connection, message.channel, message.guild)
    const embed = new Discord.MessageEmbed()
      .setColor(hex.gray)
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTitle(`Reaga com a ação que deseja realizar!`)
      .setTimestamp()
      .setFooter(`Sistema de configurações ${client.user.username}`, client.user.displayAvatarURL())
      .setDescription(`**<:${emojis.textchannelclaro}> \`|\` ${getCalcOptions.canalAtual ? 'Desativar calculadora neste canal' : 'Ativar calculadora neste canal'}\n<:${emojis.listademembros}> \`|\` ${getCalcOptions.canaisAtivos > 0 ? 'Desativar a calculadora em todo o servidor' : 'Ativar a calculadora em todos os canais do servidor'}**`)
    if(podeEnviarMsg) {
      const msg = await message.channel.send(embed)
      if(podeAddReactions) {
        await msg.react(emojis.textchannelclaro)
        await msg.react(emojis.listademembros)
      } else {
        return run(message, client, `<:${emojis.xcirclered}> Eu preciso da permissão de adicionar reações aqui para poder continuar a configuração!`, emojis.xcirclered)
      }
      const filter = (reaction, user) => user.id === message.author.id
      const collector = msg.createReactionCollector(filter, { max: 1, time: 20000 })
      collector.on('collect', async (reaction, user) => {
        if(reaction.emoji.identifier === emojis.textchannelclaro) {
          const embedConclusao = new Discord.MessageEmbed()
            .setColor(hex.gray)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(`O comando **calculator** foi ${getCalcOptions.canalAtual ? 'desativado' : 'ativado'} neste canal!`)
            .setTimestamp()
            .setFooter(`Sistema de configurações ${client.user.username}`, client.user.displayAvatarURL())
          connection.query(`update channels set calc = '${!getCalcOptions.canalAtual ? 1 : 0}' where channelid = '${message.channel.id}'`)
          channelsCache[message.guild.id][message.channel.id] = !getCalcOptions.canalAtual ? 1 : 0
          msg.edit(embedConclusao)
        } else if (reaction.emoji.identifier === emojis.listademembros) {
          const embedConclusao = new Discord.MessageEmbed()
            .setColor(hex.gray)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(`O comando **calculator** foi ${getCalcOptions.canaisAtivos > 0 ? 'desativado' : 'ativado'} neste servidor!`)
            .setTimestamp()
            .setFooter(`Sistema de configurações ${client.user.username}`, client.user.displayAvatarURL())
          connection.query(`update channels set calc = '${!getCalcOptions.canaisAtivos > 0 ? 1 : 0}' where serverid = '${message.guild.id}'`)
          for(let i = 0; i < Object.keys(channelsCache[message.guild.id]).length; i++) {
            channelsCache[message.guild.id][Object.keys(channelsCache[message.guild.id])[i]] = !getCalcOptions.canaisAtivos > 0 ? 1 : 0
          }
          msg.edit(embedConclusao)
        }
      })
    } else if (podeAddReactions) {
      message.react(emojis.alertcircleamarelo)
    }
  }
}