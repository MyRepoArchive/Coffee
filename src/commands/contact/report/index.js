const Discord = require('discord.js');
const { lightstategray } = require('../../../utils/colors.json');
const config = require('../../../config/auth.json');
const { static: { emoji } } = require('../../../utils/emojis.json');
const client = require('../../..');
const notProvidedReport = require('./src/notProvidedReport');
const report = require('./src/report');

module.exports = {
  config: require('./src/config'),

  async run({ message, args, comando, prefix }) {
    if (!args.length) return notProvidedReport(message, prefix);

    const reportContent = args.join(' ');
    const reportChannel = client.channels.cache.get(config.report);
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const reportEmbed = new Discord.MessageEmbed()
      .setColor(lightstategray)
      .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL())
      .setDescription(reportContent)
      .setTimestamp()
      .setFooter(`Canal: "${message.channel.id}". Servidor: "${message.channel.guild.id}"`);
    report(reportContent);
    await reportChannel.send(reportEmbed) // Envia o report no canal específico de reports
    if(podeAddReactions) { // Verifica se pode adicionar reações no canal
      message.react(emojis.circlecheckverde).then(() => {
        message.react(emojis.send)
      })
    } else if(podeEnviarMsg) { // Se não poder, verifica se pode enviar mensagens no canal
      message.channel.send(`<:${emojis.circlecheckverde}> Pronto ${message.author}, seu report foi enviado com sucesso!`)
    }
  }
};

