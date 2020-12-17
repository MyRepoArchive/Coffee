const verifyActiveCooldown = require('../../../functions/verifyActiveCooldown');
const chatOrDm = require('../../../functions/chatOrDm');
const client = require('../../..');
const { animated: { emoji: { loading2 } } } = require('../../../utils/emojis.json');

module.exports = {
  config: require('./src/config'),

  async run({ message, args }) {
    if (!verifyActiveCooldown(message, this.config)) return;

    const param = args.join(' ').toLowerCase();
    const permissions = message.channel.permissionsFor(client.user);

    if (param === 'bot') return chatOrDm(`${loading2} Carregando...`, permissions, message).then(mess => {
      mess.edit(`> ${mess.createdTimestamp - message.createdTimestamp}ms`);
    }, () => { });
    if (param === 'api') return chatOrDm(`> ${client.ws.ping}ms`, permissions, message).catch(() => { });
    if (param === 'database' || param === 'db' || param === 'banco') return chatOrDm(`> ${Math.round(await dbPing())}ms`, permissions, message).catch(() => {});

    chatOrDm(`${loading2} Carregando...`, permissions, message).then(async mess => {
      mess.edit(`Ping do bot é de **${mess.createdTimestamp - message.createdTimestamp}ms**, da API é de **${client.ws.ping}ms** e do banco é **${Math.round(await dbPing())}ms**`)
    });



    async function dbPing() {
      const start = process.hrtime();

      await client.db.ref('/last_id').once('value');

      const stop = process.hrtime(start);
      return ((stop[0] * 1e9) + stop[1]) / 1e6;
    };
  }
}