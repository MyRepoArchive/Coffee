const Discord = require('discord.js');
const { admins } = require('../../../config/default.json');
const unauthorized = require('./src/unauthorized');
const notProvidedEval = require('./src/notProvidedEval');
const { gray, orangered } = require('../../../utils/colors.json');
const { static, animated } = require('../../../utils/emojis.json');
const moment = require('moment');
const client = require('../../..');

module.exports = {
  config: require('./src/config'),

  async run({ message, args }) {
    const { verifyActiveCooldown, error } = require('../../../functions');
    const { active, reason_inactivity, cooldownControl, cooldown, times_limit } = this.config;
    const evalContent = args.join(' ');
    const permissions = message.channel.permissionsFor(client.user);

    if (!verifyActiveCooldown(message, active, reason_inactivity, cooldownControl, cooldown, times_limit)) return;
    if (!admins.includes(message.author.id)) return unauthorized(message);
    if (!evalContent) return notProvidedEval(message);

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag + '|' + message.author.id, message.author.displayAvatarURL())
      .setColor(gray)
      .addField('Input', `\`\`\`${evalContent}\`\`\``)
      .setTimestamp();

    try {
      const evalValue = `${eval(evalContent)}`;

      if (evalValue.length > 2012) await message.author.send({ files: [{ name: `eval_${moment().locale('pt-br').format('llll')}.txt`, attachment: Buffer.from(evalValue) }] })
        .then(() => embed.setFooter('Todo o valor do eval foi enviado para a sua DM!'), () => embed.setFooter('Não consegui lhe enviar o restante pela DM'));
      
      embed.setDescription(`\`\`\`${`${evalValue}`.slice(0, 2012)}\`\`\``);
    } catch (e) {
      e = `${e}`;

      if (e.length > 2012) await message.author.send({ files: [{ name: `eval_erro_${moment().locale('pt-br').format('llll')}.txt`, attachment: Buffer.from(e) }] })
        .then(() => embed.setFooter('Todo o valor do erro foi enviado para a sua DM!'), () => embed.setFooter('Não consegui lhe enviar o restante pela DM'));
      
      embed
        .setColor(orangered)
        .setDescription(`\`\`\`${e.slice(0, 2012)}\`\`\``);
    };

    if (!permissions.has("SEND_MESSAGES")) return dm();

    message.channel.send(embed).then(msg => {
      if (permissions.has("ADD_REACTIONS")) message.react(static.eID.emojicoffeetrashrecycling)

      // Coletor para apagar o conteúdo do eval!
      msg.createReactionCollector((react, user) => react.emoji.id === static.eID.emojicoffeetrashrecycling && user.id === message.author.id, { time: 600000 })
        .on('collect', () => msg.edit(`> ${static.emoji.emojicoffeetrashrecycling} Deletado!`, { embed: null }).catch(e => error(
          `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
          '> Não foi possível editar um eval, para deletá-lo!\n' +
          `> Path: "${__filename}"\n` +
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        )));
      
      // Coletor para salvar o conteúdo do eval!
      msg.createReactionCollector((react, user) => react.emoji.id === static.eID.emojicoffeesave && user.id === message.author.id, { time: 600000 })
        .on('collect', async () => {
          const savingMsg = await message.channel.send(`> ${animated.emoji.loading2} Salvando...`).catch(e => error(
            `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
            '> Aconteceu um erro ao enviar uma mensagem de salvamento de eval!\n' +
            `> Path: "${__filename}"\n` +
            `> Erro: "${JSON.stringify(e, null, 4)}"`
          ));

          message.author.send({ files: [{
            name: `saved_eval_${moment().locale('pt-br').format('llll')}.txt`,
            attachment: Buffer.from(
              '>>> Input <<<\n\n' +
              evalContent + '\n\n\n' +
              '>>> Output <<<\n\n' +
              embed.description
            )
          }] }).then(() => 
            savingMsg && savingMsg.edit(`> ${static.emoji.emojicoffeesave} Salvo.`), 
            e => {
              savingMsg && savingMsg.edit(`> ${static.emoji.emojicoffeeerro} Erro!`);
              
              error(
                `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
                '> Não foi possível enviar um saved_eval para a DM de um usuário!\n' +
                `> Path: "${__filename}"\n` +
                `> Erro: "${JSON.stringify(e, null, 4)}"`
              );
            }
          )
        })
    })

    function dm() {
      message.author.send(embed)
        .catch(() => {
          if (permissions.has("ADD_REACTIONS")) message.react(static.eID.emojicoffeeerro)
            .catch(e => {
              error(
                `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
                '> Houve um problema ao tentar adicionar uma reação em um comando.\n' +
                `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
                `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
                `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
                `> Path: "${__filename}"\n` +
                `> Erro: "${JSON.stringify(e, null, 4)}"`
              );
            });
        });
    };

    const { run } = require('../utils/errorAlert.js.js')
    const botMembro = message.guild.member(client.user.id) // O membro do bot no servidor em que foi enviado a mensagem
    const permissoesBot = message.channel.memberPermissions(botMembro) // As permissões que o bot tem no canal em que foi enviada a mensagem
    const podeEnviarMsg = permissoesBot.has("SEND_MESSAGES") // Um boolean se o bot pode enviar mensagens naquele canal
    const podeAddReactions = permissoesBot.has("ADD_REACTIONS")
    const evalContent = args.join(' ')
    const evalEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`Sistema de ajuda em desenvolvimento ${client.user.username}`, client.user.displayAvatarURL())
    if(!config.owners.includes(message.author.id)) return run(message, client, `<:${emojis.slashred}> Você não pode usar esse tipo de comando!`, emojis.slashred)
    if(!evalContent) return run(message, client, `<:${emojis.alertcircleamarelo}> Insira um valor válido!`, emojis.alertcircleamarelo)
    try {
      embed.setColor(gray)
      evalEmbed
        .setDescription(`\`\`\`${`${eval(evalContent)}`.slice(0, 2012)}\`\`\``)
        .addField(
        { name: '<:login:745708185611927553> Input', value: `\`\`\`${evalContent}\`\`\`` },
        { name: '<:logout:745708185540886688> Output', value:  `\`\`\`${`${eval(evalContent)}`.slice(0, 1000)}\`\`\``}
      )
    } catch (err) {
      evalEmbed.setColor(hex.orangered)
      evalEmbed.addFields(
        { name: '<:login:745708185611927553> Input', value: `\`\`\`${evalContent}\`\`\`` },
        { name: '<:logout:745708185540886688> Output', value: `\`\`\`${err}\`\`\`` }
      )
    }
    
    if(podeEnviarMsg) {
      const msg = await message.channel.send(evalEmbed)
      if(podeAddReactions) {
        msg.react(emojis.medialock)
        const filter = (react, user) => react.emoji.identifier === emojis.medialock && config.owners.includes(user.id)
        const collector = msg.createReactionCollector(filter, { time: 600000 })
        collector.on('collect', (react, user) => {
          msg.edit(`<:${emojis.medialock}> Este eval foi trancado!`, { embed: null })
          const reaction = msg.reactions.cache.find(react => react.emoji.identifier === emojis.medialock)
          if(reaction) reaction.users.remove(client.user.id)
        })
      }
    } else if(podeAddReactions) message.react(emojis.alertcircleamarelo)
  }
}