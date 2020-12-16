const { admins } = require('../../../../config/default.json');
const error = require('../../../../functions/error');
const reprover = require('./reprover');
const { static: { emoji } } = require('../../../../utils/emojis.json');

module.exports = (reportId, channelReprovado, message) => {
  message.edit('Digite o motivo abaixo!');

  message.channel.createMessageCollector(msg => admins.includes(msg.author.id), { max: 1 }).on('collect', (msg) => {
    msg.delete().catch(e => error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      '> Houve um erro ao deletar uma mensagem no canal de análise de reports.\n' +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 2)}"`
    ))
    reprover(reportId, channelReprovado, message, msg.content);
  });
};