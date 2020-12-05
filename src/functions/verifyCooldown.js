const { admins } = require('../config/default.json');
const client = require('..');
const { static: { emoji, eID } } = require('../utils/emojis.json');
const error = require('./error');

module.exports = (message, controller, time = 3000, timesLimit = 1) => {
  let authorized = false;

  if (!message) {
    error(withoutParam('message'));
    return true; 
  };

  if (!controller) {
    error(withoutParam('controller'));
    return true;
  };

  if (admins.includes(message.author.id)) return true;

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
    `> ${emoji.emojicoffeeinfo} Aviso!\n`+
    '> Você está tentando usar este comando muitas vezes seguidas, por favor aguarde!\n'+
    `> Tempo: ${waitingTime}`;
  
  if (controller[message.author.id].times > timesLimit) {
    if (timeBetween < time) {
      if (permissions.has('SEND_MESSAGES')) {
        message.channel.send(msg)
          .catch(e => {
            dm();
    
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n`+
              '> Houve um erro ao tentar enviar um alerta de cooldown.\n'+
              `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
              `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
              `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
              `> Path: "${__filename}"\n` +
              `> Erro: "${JSON.stringify(e, null, 4)}"`
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
      .catch(() => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando.\n'+
              `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
              `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
              `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
              `> Path: "${__filename}"\n` +
              `> Erro: "${JSON.stringify(e, null, 4)}"`
            );
          });
      });
  };

  function withoutParam(param) {
    return (
      `> ${emoji.emojicoffeeinfo} Aviso!\n`+
      '> A função "verifyCooldown" está sendo chamada sem o parâmetro "' + param + '", que é essencial para o pleno funcionamento da mesma.\n'+
      `> Path: "${__filename}"`
    );
  };
};