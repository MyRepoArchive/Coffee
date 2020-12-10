const update = require('../../../../controllers/prefixes/update');
const chatOrDm = require('../../../../functions/chatOrDm');
const error = require('../../../../functions/error');
const { static: { emoji } } = require('../../../../utils/emojis.json');
const bigPrefix = require('./bigPrefix');

module.exports = (oldPrefix, newPrefix, message, permissions) => {
  if (newPrefix.length > 10) return bigPrefix(oldPrefix, permissions, message);

  const msg =
    `> ${emoji.emojicoffeecheck} Check!\n` +
    '> Foi setado um novo prefixo no servidor!\n' +
    `> Prefixo antigo: \`${oldPrefix}\`\n` +
    `> Novo prefixo: \`${newPrefix}\``;
  
  if (oldPrefix === newPrefix) return chatOrDm(msg, permissions, message);

  const obj = {};
  obj[message.guild.id] = newPrefix;

  update(obj).then(r => {
    chatOrDm(msg, permissions, message);
  }, e => {
    error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao setar um novo prefixo em um dos servidores.\n` +
      `> Path: "${__filename}"\n` +
      `> OldPrefix: "${oldPrefix}"\n` +
      `> NewPrefix: "${newPrefix}"\n` +
      `> Erro: ${e}`
    );

    const errMsg =
      `> ${emoji.emojicoffeeerro} Erro\n` +
      '> Houve um erro ao setar um novo prefixo no servidor\n' +
      '> Nossa equipe foi notificada e se necessário, entrará em contato!';

    chatOrDm(errMsg, permissions, message);
  })
};