const { log } = require('../config/default.json');
const { static: { emoji } } = require('../utils/emojis.json');
const client = require('..');
const moment = require('moment');
const logJs = require('../utils/log');
const error = require('./error');
const sendHtmlDoc = require('./sendHtmlDoc');

module.exports = (msg) => {
  logJs[moment().locale('pt-br').format('LLLL')] = msg;

  client.channels.fetch(log)
    .then(channel => {
      if (!channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) return error(
        `> ${emoji.emojicoffeeinfo} Aviso\n` +
        '> Não possuo permissão para enviar mensagens no canal cadastrado para logs.\n' +
        `> ID do canal: '${log}'.\n` +
        `> Path: "${__filename}"\n` +
        `> Log: "${msg}".`
      );
    
      if (!channel.permissionsFor(client.user).has('VIEW_CHANNEL')) return error(
        `> ${emoji.emojicoffeeinfo} Aviso!\n`+
        '> Não possui permissão para acessar o canal cadastrado para logs.\n' +
        `> ID do canal: '${log}'.\n` +
        `> Path: "${__filename}"\n` +
        `> Log: "${msg}"`
      );
    
      channel.send(msg).catch(e => sendHtmlDoc(e, msg, channel, errSendLog).catch(() => errSendLog(e)));
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso\n` +
      '> Não foi possível encontrar o canal que está cadastrado para logs.\n' +
      `> ID do canal: '${log}'.\n` +
      `> Path: "${__filename}"\n` +
      `> Log: "${msg}"`
    ));

  function errSendLog(e) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n` +
      '> Ocorreu um erro ao enviar um novo log no canal cadastrado para logs.\n' +
      `> ID do canal: '${log}'.\n` +
      `> Path: "${__filename}"\n` +
      `> Log: "${msg}".\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    );
  };
};