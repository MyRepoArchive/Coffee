const Discord = require('discord.js');
const hex = require('../colors.json');
const config = require('../info.json')
const pad = require('../utils/pad.js')
const consoleColors = ['\033[0m', '\033[30m', '\033[31m', '\033[32m', '\033[33m', '\033[34m', '\033[35m', '\033[36m', '\033[37m'];
const changeActivity = require('../utils/changeActivity.js')

module.exports = {
  name: "message",

  async execute(client, message, connection) {
    if (message.author.bot) return; // Verifica se o autor é um bot, se for, retorna
    if (message.channel.type === 'dm') return; // Verifica se a mensagem foi enviada na dm, se for, retorna
    const prefix = await require('../utils/prefix.js').getPrefix(connection, message)
    const args = message.content.slice(prefix.length).trim().split(/ +/g); // Um array com cada palavra digitada pelo usuário
    const comando = args.shift().toLowerCase(); // A primeira palavra do args minúscula
    const firstWord = message.content.trim().split(/ +/g).shift().toLowerCase(); // A primeira palavra da mensagem
    const logErrorChannel = client.channels.cache.get(config.logErro); // Canal para log dos erros
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const podeCriarInvite = permissoesBot.has("CREATE_INSTANT_INVITE");
    const podeManageMessages = permissoesBot.has("MANAGE_MESSAGES");
    const errorAlert = require('../utils/errorAlert.js')
    if (firstWord === `<@${client.user.id}>`) { // Se a primeira palavra da mensagem for uma menção ao bot, ele responde
      if (podeEnviarMsg) { // Verifica se o bot pode mandar mensagem
        message.reply(`Alguém me chamou??🤗 Se estiver precisando de ajuda, use **${prefix}ajuda**`)
      }
      return;
    }
    if (!isNaN(Number(message.content.slice(0, 1))) || message.content.startsWith('-')) { // Se o primeiro caractere da mensagem for um número ou um sinal de menor, ele chama a função de calculo
      require('../commands/calculator.js').calc(message, client)
    }
    if (!message.content.startsWith(prefix)) return; // Se a mensagem não iniciar com o prefixo do bot, retorna
    if (!client.commands.has(comando)) { // Se o comando digitado pelo usuário não for compatível com nenhum comando do bot, ele responde
      if (podeEnviarMsg && podeManageMessages) { // Verifica se pode enviar mensagens e pode deleta-las
        const resp = await message.channel.send(`<:terminalblue:747879940749393951> Eu não conheço esse comando, use **${prefix}ajuda** para saber todos os meus comandos!`);
        resp.delete({ timeout: 5000 }) // Após 5 segundos desde o envio da mensagem acima, ele  a deleta
      }
      return;
    }
    if (client.commands.get(comando).type === 'Economia') return errorAlert.run(message, client, `<:xcirclered:747879954708037662> Os comandos de **Economia** estão em produção no momento e não estão disponíveis para uso, toda a equipe de desenvolvimento do ${client.user.username} pede desculpas pelo ocorrido!`, 'xcirclered:747879954708037662');
    try { // Tenta executar o comando do usuário
      client.commands.get(comando).execute(message, args, comando, client, prefix, connection);
    } catch (error) { // Caso não consiga executar o comando, loga o erro
      const errorEmbed = new Discord.MessageEmbed()
        .setColor(hex.orangered)
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle(`Erro ao executar comando ${comando}`)
        .setDescription(`<:alertcircleamarelo:747879938207514645> Houve um erro ao executar o comando **${comando}**!`)
        .addField(`<:serverblue:747879939734372392> Servidor`, `**${message.guild.name}** \`${message.guild.id}\``)
        .addField(`<:userblue:747880223214796941> Quem executou`, `**${message.author.tag}**\n\`${message.author.id}\``)
        .addField(`<:unlockblue:747879943077101579> Permissões`, `\`${message.member.permissions.toArray().join('`, `')}\``)
        .addField(`<:tagblue:747879941508694036> Dono do servidor`, `**${message.guild.owner.user.tag}** \`${message.guild.ownerID}\``)
        .addField(`<:xcirclered:747879954708037662> Erro`, error)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter(`Sistema de logs ${client.user.username}`, client.user.displayAvatarURL())
      if (podeEnviarMsg) { // Verifica se pode enviar mensagens no canal
        await message.reply('<:alertcircleamarelo:747879938207514645> Houve um erro ao executar esse comando! A Equipe já foi informada!')
      } else if (podeAddReactions) { // Se não pode enviar mensagens, vai verificar se pode adicionar reações
        await message.react('alertcircleamarelo:747879938207514645')
      }
      console.log(error); // Loga o erro no console
      if (podeCriarInvite) { // Verifica se naquele canal pode criar um convite, caso possa, vai adicionar o link na url da embed
        await message.channel.createInvite({ maxAge: 0, reason: `Houve um erro ao executar um comando do bot ${client.user.tag} e os administradores precisam ser chamados para averiguar o problema` }).then(invite => {
          errorEmbed.setURL(`https://discord.gg/${invite.code}`)
        })
      }
      logErrorChannel.send(errorEmbed)
    }
  }
}