const notProvidedParams = require('./src/notProvidedParams');
const notFoundMember = require('./src/notFoundMember');
const NaNMoney = require('./src/NaNMoney');
const client = require('../../..');
const update = require('../../../controllers/members/update');
const error = require('../../../functions/error');
const { static: { emoji } } = require('../../../utils/emojis.json');
const chatOrDm = require('../../../functions/chatOrDm');

module.exports = {
  config: require('./src/config'),

  run({ message, args, permissions, prefix }) {
    if (!args.length) return notProvidedParams(message, permissions, prefix);

    const paramMember = args.slice(0, args.length - 1).join(' ');
    const paramValue = args[args.length - 1].replace(/,/g, '.');

    if (!paramMember || !paramValue) return notProvidedParams(message, permissions, prefix);

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.find(member => (
        paramMember === member.id ||
        paramMember === member.displayName ||
        paramMember === member.user.username
      ));

    if (!member) return notFoundMember(message, permissions, paramMember);

    const oldMoneyValue = client.db.cache.members[`${message.guild.id}-${member.id}`] ?
      client.db.cache.members[`${message.guild.id}-${member.id}`].money :
      0;
    const newMoneyValue = Number(Number(paramValue).toFixed(2));

    if (isNaN(newMoneyValue)) return NaNMoney(message, permissions);

    const msg =
      `> ${emoji.emojicoffeecheck} Check!\n` +
      `> Foi setado um novo valor de dinheiro no membro ${member}!\n` +
      `> Valor anterior: \`${oldMoneyValue}\`\n` +
      `> Valor atual: \`${newMoneyValue}\``;

    if (oldMoneyValue === newMoneyValue) return chatOrDm(msg, permissions, message);

    const obj = {};

    obj[`${message.guild.id}-${member.id}`] = client.db.cache.members[`${message.guild.id}-${member.id}`] || {
      created_timestamp: null,
      guild_id: message.guild.id,
      id: `${message.guild.id}-${member.id}`,
      money: newMoneyValue,
      score: 0,
      user_id: member.id
    };

    obj[`${message.guild.id}-${member.id}`].money = newMoneyValue;

    update(obj, { orCreate: true }).then(() => {
      chatOrDm(msg, permissions, message).catch(() => { });
    }, e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao atualizar o dinheiro de um membro do banco de dados!\n` +
      `> O membro: ${message.guild.id}-${member.id}\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${e}"`
    ));
  }
};