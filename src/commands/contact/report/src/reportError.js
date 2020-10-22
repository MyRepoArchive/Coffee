const client = require('../../../..');
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const { error } = require('../../../../functions');

module.exports = (message) => {
  if (!message) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
    '> A função "reportError" está sendo chamada sem o parâmetro "message" que é essencial para o correto funcionamento da mesma.\n'+
    `> Path: "${__filename}"`
  );

  const msg =
    `> ${emoji.emojicoffeeerro} Erro!\n\n`+
    '> Houve um erro ao criar o seu report, nossa equipe será notificada e se necessário entrará em contato.\n'+
    '> Status: "NÃO CRIADO"'

  const permissions = message.channel.permissionsFor(client.user);

  if (permissions.has('SEND_MESSAGES')) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um erro ao enviar um aviso que um comando não havia funcionado da maneira esperada.\n' +
          `> ID do canal do erro: "${message.channel.id}"\n` +
          `> Erro: "${e}"`
        );
      })
  } else dm();

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando que não teve a resposta esperada!\n' +
              `> ID do canal do erro: "${message.channel.id}"\n` +
              `> Erro: "${e}"`
            );
          });;

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um problema ao enviar um aviso que o comando não havia funcionado corretamente para a DM de um usuário!\n' +
          `> Usuário: ${message.author.tag} \`${message.author.id}\`\n` +
          `> Erro: "${e}"`
        );
      });
  };
};