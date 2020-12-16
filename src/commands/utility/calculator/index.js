const client = require('../../..');
const exec = require('./src/exec');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = {
  config: require('./src/config'),

  run({ message, args, prefix }) {
    const expressao = 
      args.join(' ').toLowerCase().replace(/π/g, 'pi').replace(/÷|:/g, '/').replace(/×/g, '*').replace(/\*\*/g, '^').replace(/'|\[|\]|\{|\}/g, '');

    const permissions = message.channel.permissionsFor(client.user);

    if (!expressao) {
      if (permissions.has('SEND_MESSAGES')) message.channel.send(
        `> ${emoji.emojicoffeeinfo} Aviso!\n` +
        `> Você deve passar como parâmetro da mensagem a expressão matemática que será calculada pelo bot.\n` +
        `> Para saber mais utilize ${prefix}ajuda calc.`
      ).catch(() => {});
      return;
    };

    exec(expressao).then(result => {
      if (result === false) {
        if (permissions.has('SEND_MESSAGES')) message.channel.send(`\`\`\`diff\n- Expressão inválida!\`\`\``).catch(() => {});
        return;
      };
      if (permissions.has('SEND_MESSAGES')) message.channel.send(`\`\`\`js\n${result}\`\`\``).catch(() => {});
    });
  },

  calc(message) {
    const perm = client.db.cache.channels[message.channel.id].calc_perm;

    if (perm === 0) return;

    const expressao =
      message.content.toLowerCase().replace(/π/g, 'pi').replace(/÷|:/g, '/').replace(/×/g, '*').replace(/\*\*/g, '^').replace(/'|\[|\]|\{|\}/g, '');

    const permissions = message.channel.permissionsFor(client.user);
    const numbers = expressao.match(/\d+/g);

    if (!numbers) return;
    if (expressao.startsWith('-') && numbers.length === 1) return;
    if (expressao.startsWith('(') && numbers.length === 1) return;
    if (Number(expressao)) return;

    exec(expressao).then(result => {
      if (result === false) return;
      if (permissions.has('SEND_MESSAGES')) message.channel.send(`\`\`\`js\n${result}\`\`\``).catch(() => {});
    });
  }
};