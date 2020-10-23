const { erro } = require('../../config/default.json');
const { static: { emoji } } = require('../../utils/emojis.json');
const client = require('../..');
const { alertAdmins } = require('..');

module.exports = (msg) => {
  const channel = client.channels.cache.get(erro);

  if (!channel) return alertAdmins(
    `> ${emoji.emojicoffeeinfo} Aviso\n`+
    '> Olá querido administrador, não foi possível encontrar o canal que está cadastrado para envio de erros e avisos.\n'+
    `> ID do canal: '${erro}'.\n`+
    `> Aviso/erro a ser enviado: "${msg}".`
  );

  if (!channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) return alertAdmins(
    `> ${emoji.emojicoffeeinfo} Aviso\n`+
    '> Olá querido administrador, não possuo permissão para enviar mensagens no canal cadastrado para envio de erros e avisos.\n'+
    `> ID do canal: '${erro}'.\n`+
    `> Aviso/erro a ser enviado: "${msg}".`
  );

  channel.send(msg)
  .catch(e => {
    alertAdmins(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Olá meu querido administrador, ocorreu um erro ao enviar um novo aviso/erro no canal cadastrado para envio de erros e avisos.\n'+
      `> ID do canal: '${erro}'.\n`+
      `> O aviso/erro que deveria ser enviado: "${msg}".\n`+
      `> Erro que ocorreu durante o processo: "${e}".`
    );
  });
};