const Discord = require('discord.js');
const { admins } = require('../../../config/default.json');
const unauthorized = require('./src/unauthorized');
const notProvidedEval = require('./src/notProvidedEval');
const { gray, orangered } = require('../../../utils/colors.json');
const { static, animated } = require('../../../utils/emojis.json');
const moment = require('moment');
const client = require('../../..');
const reactionCollectors = require('./src/reactionCollectors');
const messageCollectors = require('./src/messageCollectors');
const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');
const error = require('../../../functions/error');
const credentials = Object.values(require('../../../config/auth.json'));

module.exports = {
  config: require('./src/config'),

  async run({ message, args }) {
    
    const { active, reason_inactivity, cooldownControl, cooldown, times_limit } = this.config;
    const evalContent = args.join(' ');
    const permissions = message.channel.permissionsFor(client.user);

    if (!verifyActiveCooldown(message, active, reason_inactivity, cooldownControl, cooldown, times_limit)) return;
    if (!admins.includes(message.author.id)) return unauthorized(message);
    if (!evalContent) return notProvidedEval(message);
    
    const preMessage = await message.channel.send(`> ${animated.emoji.loading2} Processando...`).catch(() => {});

    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag + '|' + message.author.id, message.author.displayAvatarURL())
      .setColor(gray)
      .addField('Input', `\`\`\`${evalContent}\`\`\``)
      .setTimestamp();

    try {
      const evalValue = `${eval(evalContent)}`;

      if (evalValue.length > 2012)
        await message.author.send({ files: [{ name: `eval_${moment().locale('pt-br').format('llll')}.txt`, attachment: Buffer.from(evalValue) }] })
          .then(() => embed.setFooter('Todo o valor do eval foi enviado para a sua DM!'), () => embed.setFooter('Não consegui lhe enviar o restante pela DM'));

      embed.setDescription(`\`\`\`${`${evalValue}`.slice(0, 2012)}\`\`\``);
    } catch (e) {
      e = `${e}`;

      if (e.length > 2012)
        await message.author.send({ files: [{ name: `eval_erro_${moment().locale('pt-br').format('llll')}.txt`, attachment: Buffer.from(e) }] })
          .then(() => embed.setFooter('Todo o valor do erro foi enviado para a sua DM!'), () => embed.setFooter('Não consegui lhe enviar o restante pela DM'));

      embed
        .setColor(orangered)
        .setDescription(`\`\`\`${e.slice(0, 2012)}\`\`\``);
    };

    if (credentials.find(cred => embed.description.includes(cred)) !== undefined) {
      dm();
      return message.channel.send(
        `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
        '> Credenciais encontradas, eval enviado na dm!'
      ).catch(() => {});
    }
    if (!permissions.has("SEND_MESSAGES")) return dm();

    message.channel.send('', { embed: embed }).then(msg => {
      if (permissions.has("ADD_REACTIONS")) {
        msg.react(static.eID.emojicoffeetrashrecycling).catch(e => reactionErr(e));
        msg.react(static.eID.emojicoffeeenveloppe).catch(e => reactionErr(e));
        msg.react(static.eID.emojicoffeesave).catch(e => reactionErr(e));
      };

      // Cria os três coletores de reações que apagam, salvam ou enviam o eval
      reactionCollectors(msg, message, evalContent, embed);

      // Cria os três coletores de mensagens que apagam, salvam ou enviam o eval
      messageCollectors(message, evalContent, msg, embed);

      if (preMessage) preMessage.delete().catch(() => {});
    }, () => dm());

    function dm() {
      if (preMessage) preMessage.delete().catch(() => {});
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

    function reactionErr(e) {
      error(
        `> ${static.emoji.emojicoffeeinfo} Aviso!\n` +
        '> Houve um erro ao tentar adicionar uma reação em um eval\n' +
        `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
        `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
        `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
        `> Path: "${__filename}"\n` +
        `> Erro: "${JSON.stringify(e, null, 4)}"`
      );
    };
  }
}