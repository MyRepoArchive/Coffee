const { log } = require('../../config/default.json');
const { static: { emoji } } = require('../../utils/emojis.json');
const client = require('../..');
const moment = require('moment');
const fs = require('fs');

module.exports = (msg) => {
  const channel = client.channels.cache.get(log);
  const { error } = require('..');

  fs.writeFileSync('./src/utils/log.txt', fs.readFileSync('./src/utils/log.txt', { encoding: 'utf8' }) +
    '\n\n\n\n' +
    '>>> ' + moment().locale('pt-br').format('LLLL') + ' <<<' +
    '\n\n' +
    msg
  );

  if (!channel) return error(
    `> ${emoji.emojicoffeeinfo} Aviso\n` +
    '> Não foi possível encontrar o canal que está cadastrado para logs.\n' +
    `> ID do canal: '${log}'.\n` +
    `> Path: "${__filename}"\n` +
    `> Log: "${msg}"`
  );

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

  channel.send(msg)
    .catch(e => error(
      `> ${emoji.emojicoffeeinfo} Aviso\n` +
      '> Ocorreu um erro ao enviar um novo log no canal cadastrado para logs.\n' +
      `> ID do canal: '${log}'.\n` +
      `> Path: "${__filename}"\n` +
      `> Log: "${msg}".\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
};