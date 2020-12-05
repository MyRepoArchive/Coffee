const { erro } = require('../../config/default.json');
const { static: { emoji } } = require('../../utils/emojis.json');
const client = require('../..');
const moment = require('moment');
const logJs = require('../../utils/log');
const alertAdmins = require('./alertAdmins');
const sendHtmlDoc = require('./sendHtmlDoc');

module.exports = (msg) => {
  logJs[moment().locale('pt-br').format('LLLL')] = msg;

  client.channels.fetch(erro)
    .then(channel => {
      if (!channel.permissionsFor(client.user).has('SEND_MESSAGES')) return alertAdmins(
        `> ${emoji.emojicoffeeinfo} Aviso\n` +
        '> Olá querido administrador, não possuo permissão para enviar mensagens no canal cadastrado para envio de erros e avisos.\n' +
        `> ID do canal: '${erro}'.\n` +
        `> Path: "${__filename}"\n` +
        `> Aviso/Erro: "${msg}".`
      );

      if (!channel.permissionsFor(client.user).has('VIEW_CHANNEL')) return alertAdmins(
        `> ${emoji.emojicoffeeinfo} Aviso!\n`+
        '> Não possui permissão para acessar o canal cadastrado para envio de erros e avisos.\n' +
        `> ID do canal: '${erro}'.\n` +
        `> Path: "${__filename}"\n` +
        `> Aviso/Erro: "${msg}"`
      );

      channel.send(msg).catch(e => sendHtmlDoc(e, msg, channel, errSendError).catch(() => errSendError(e)));
    }, e => alertAdmins(
      `> ${emoji.emojicoffeeinfo} Aviso\n` +
      '> Olá querido administrador, não foi possível encontrar o canal que está cadastrado para envio de erros e avisos.\n' +
      `> ID do canal: '${erro}'.\n` +
      `> Path: "${__filename}"\n` +
      `> Aviso/Erro: "${msg}"`
    ));

  function errSendError(e) {
    alertAdmins(
      `> ${emoji.emojicoffeeinfo} Aviso\n` +
      '> Olá meu querido administrador, ocorreu um erro ao enviar um novo aviso/erro no canal cadastrado para envio de erros e avisos.\n' +
      `> ID do canal: '${erro}'.\n` +
      `> Path: "${__filename}"\n` +
      `> Aviso/Erro: "${msg}".\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    );
  };
};