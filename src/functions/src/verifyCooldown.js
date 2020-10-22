const { admins } = require('../../config/default.json');
const client = require('../..');
const { static: { emoji, eID } } = require('../../utils/emojis.json');
const { error } = require('..');

module.exports = (message, controller, time = 3000, timesLimit = 1) => {
  let authorized = false;

  if (!message) {
    authorized = true;
    error(withoutParam('message'));
  };

  if (!controller) {
    authorized = true;
    error(withoutParam('controller'));
  };

  if (admins.includes(message.author.id)) authorized = true;

  if (!controller[message.author.id]) controller[message.author.id] = { times: 1, timestamp: message.createdTimestamp };

  const timeBetween = message.createdTimestamp - controller[message.author.id].timestamp;
  const permissions = message.channel.permissionsFor(client.user);

  const waitingTime = time - timeBetween < 60000 ?
    (parseInt((time - timeBetween)/1000) === 1 ? 
      `${parseInt((time - timeBetween)/1000)} segundo` :
      `${parseInt((time - timeBetween)/1000)} segundos`) :
    (parseInt((time - timeBetween)/60000) === 1 ?
      `${parseInt((time - timeBetween)/60000)} minuto` :
      `${parseInt((time - timeBetween)/60000)} minutos`);

  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
    '> Você está tentando usar este comando muitas vezes seguidas, por favor aguarde!\n'+
    `> Tempo: ${waitingTime}`;
  
  if (controller[message.author.id].times > timesLimit) {
    if (timeBetween < time) {
      if (permissions.has('SEND_MESSAGES')) {
        message.channel.send(msg)
        .catch(e => {
          dm();
  
          error(
            `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
            '> Houve um erro ao tentar enviar um alerta de cooldown.\n'+
            `> ID do canal: "${message.channel.id}"\n`+
            `> Erro: "${e}"`
          );
        });
      } else dm();
    } else {
      controller[message.author.id].times = 0;
      authorized = true;
    };
  } else {
    authorized = true;
  };
  
  controller[message.author.id].times ++;
  controller[message.author.id].timestamp = message.createdTimestamp;

  return authorized;

  // Tenta enviar a mensagem na dm do user
  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando.\n'+
              `> ID do canal do erro: "${message.channel.id}"\n`+
              `> Erro: "${e}"`
            );
          });

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um problema ao enviar um alerta de cooldown para a DM de um usuário!\n'+
          `> Usuário: ${message.author.tag} \`${message.author.id}\`\n`+
          `> Erro: "${e}"`
        );
      });
  };

  function withoutParam(param) {
    return (
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "verifyCooldown" está sendo chamada sem o parâmetro "' + param + '", que é essencial para o pleno funcionamento da mesma.\n'+
      `> Path: "${__filename}"`
    );
  };
};