const client = require('../../..');
const notProvidedTime = require('./src/notProvidedTime');
const { static: { emoji } } = require('../../../utils/emojis.json');
const chatOrDm = require('../../../functions/chatOrDm');
const setTime = require('../../../controllers/activities/setTime');
const error = require('../../../functions/error');

module.exports = {
  config: require('./src/config'),

  run({ message, args, permissions }) {
    const oldTime = client.db.cache.activity_time;
    const newTime = Number(args[0]);

    if (!newTime) return notProvidedTime(message);
    if (newTime < 1000 || newTime > 2592000000) return chatOrDm(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      `> O valor para um novo tempo deve estar entre \`1000\` e \`2592000000\` milisegundos.`,
      permissions, message);

    const msg =
      `> ${emoji.emojicoffeecheck} Check!\n` +
      `> Foi setado um novo tempo de intervalo entre os activities do bot!\n` +
      `> Tempo antigo: \`${oldTime}\`\n` +
      `> Novo tempo: \`${newTime}\``;

    const errMsg =
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao setar um novo tempo no banco de dados.`;

    setTime(newTime).then(() => chatOrDm(msg, permissions, message), e => {
      chatOrDm(errMsg, permissions, message);

      error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        `> Houve um erro ao setar um novo tempo no banco de dados.\n` +
        `> Path: "${__filename}"\n` +
        `> Erro: "${e}"`
      );
    });
  }
};