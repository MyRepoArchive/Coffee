const { client } = require('../..');
const { erro } = require('../../utils/info.json');
const channel = client.channels.cache.get(erro);
const { static: { emoji } } = require('../../utils/emojis.json');
const { alertAdmins } = require('..'); 

module.exports = (msg) => {
  if (!channel) return alertAdmins(
    `> ${emoji.emojicoffeeinfo} Aviso\n\n`+
    '> Olá querido administrador, não foi possível encontrar o canal que está cadastrado para envio de erros e avisos.\n'+
    `> ID do canal: '${erro}'.\n`+
    `> Aviso/erro a ser enviado: "${msg}".`
  );

  if (!channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) return alertAdmins(
    `> ${emoji.emojicoffeeinfo} Aviso\n\n`+
    '> Olá querido administrador, não possuo permissão para enviar mensagens no canal cadastrado para envio de erros e avisos.\n'+
    `> ID do canal: '${erro}'.\n`+
    `> Aviso/erro a ser enviado: "${msg}".`
  );

  try {
    channel.send(msg);
  } catch (e) {
    alertAdmins(
      `> ${emoji.emojicoffeeinfo} Aviso\n\n`+
      '> Olá meu querido administrador, ocorreu um erro ao enviar um novo aviso/erro no canal cadastrado para envio de erros e avisos.\n'+
      `> ID do canal: '${erro}'.\n`+
      `> O aviso/erro que deveria ser enviado: "${msg}".\n`+
      `> Erro que ocorreu durante o processo: "${e}".`
    );
  };
};