const { error } = require('..');
const { static: { emoji, eID } } = require('../../utils/emojis.json');
const client = require('../..')

module.exports = (active, message) => {

  const permissions = message.channel.permissionsFor(client.user);

  const msg =
    `> ${emoji.emojicoffeeinfo} Aviso!\n`+
    '> Este comando está desativado no momento!';

  if (!active) {
    if (permissions.has('SEND_MESSAGES')) {
      message.channel.send(msg)
        .catch(e => {
          dm();

          error(
            `> ${emoji.emojicoffeeinfo} Aviso!\n`+
            '> Houve um erro ao enviar um aviso de que o comando estava desativado.\n'+
            `> ID do canal do erro: "${message.channel.id}"\n` +
            `> Erro: "${e}"`
          );
        });
    } else dm();

    return false;
  };

  return true;

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando que está desativado.\n'+
              `> ID do canal do erro: "${message.channel.id}"\n`+
              `> Erro: "${e}"`
            );
          });
      });
  }
};