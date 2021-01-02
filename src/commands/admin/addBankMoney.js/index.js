const notProvidedParams = require('./src/notProvidedParams');
const client = require('../../..');
const notFoundUser = require('../setBankMoney/src/notFoundUser');
const NaNMoney = require('../addMoney/src/NaNMoney');
const update = require('../../../controllers/users/update');
const error = require('../../../functions/error');
const { static: { emoji } } = require('../../../utils/emojis.json');
const chatOrDm = require('../../../functions/chatOrDm');

module.exports = {
  config: require('./src/config'),

  run({ message, args, permissions, prefix }) {
    if (!args.length) return notProvidedParams(message, permissions, prefix);

    const paramUser = args.slice(0, args.length - 1).join(' ');
    const paramValue = args[args.length - 1].replace(/,/g, '.');

    if (!paramUser || !paramValue) return notProvidedParams(message, permissions, prefix);

    const user =
      message.mentions.users.first() ||
      client.users.cache.find(user => paramUser === user.id || paramUser === user.username);

    if (!user) return notFoundUser(message, permissions, paramUser);

    const oldMoneyValue = client.db.cache.users[user.id] ?
      client.db.cache.users[user.id].money :
      0;
    const newMoneyValue = oldMoneyValue + Number(Number(paramValue).toFixed(2));

    if (isNaN(newMoneyValue) || !isFinite(newMoneyValue)) return NaNMoney(message, permissions);

    const msg =
      `> ${emoji.emojicoffeecheck} Check!\n` +
      `> Foi adicionado um novo valor de dinheiro no usuário ${user}!\n` +
      `> Valor anterior: \`${oldMoneyValue}\`\n` +
      `> Valor atual: \`${newMoneyValue}\``;

    if (oldMoneyValue === newMoneyValue) return chatOrDm(msg, permissions, message);

    const obj = {};

    obj[user.id] = client.db.cache.users[user.id] || {
      admin: false,
      consecutive_days: 0,
      created_timestamp: null,
      daily_timestamp: 0,
      id: user.id,
      money: newMoneyValue,
      job: 0
    };

    obj[user.id].money = newMoneyValue;

    update(obj, { orCreate: true }).then(() => {
      chatOrDm(msg, permissions, message).catch(() => { });
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao atualizar o dinheiro de um usuário do banco de dados!\n` +
      `> O usuário: ${message.guild.id}-${user.id}\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${e}"`
    ));
  }
}