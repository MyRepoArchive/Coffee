const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const client = require('../../../..');
const { error } = require('../../../../functions');

module.exports = (message, prefix) => {
  const msg = 
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
    '> Você deve passar como parâmetro do comando o seu report!\n' +
    `> Use \`${prefix}desc report\` para saber mais de como usar o comando!\n` +
    '> Status: "NÃO CRIADO"';
  
  if (!message) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
    '> A função "notProvidedReport" foi chamada sem o parâmetro "message" que é essencial para o correto funcionamento da mesma!\n' +
    `> Path: "${__filename}"`
  );

  if (!prefix) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
    '> A função "notProvidedReport" foi chamada sem o parâmetro "prefix" que é essencial para o correto funcionamento da mesma!\n' +
    `> Path: "${__filename}"`
  );

  if (typeof prefix !== "string") return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
    '> A função "notProvidedReport" foi chamada com o parâmetro "prefix" com uma valor que não é uma string, o que pode causar uma má resposta para o usuário!\n' +
    `> Tipo do "prefix": "${typeof prefix}"\n` +
    `> Path: "${__filename}"`
  );

  const permissions = message.channel.permissionsFor(client.user);

  // Verifica se o bot tem permissão para enviar mensagem no canal
  if (permissions.has("SEND_MESSAGES")) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um erro ao enviar um aviso de falta de parâmetros.\n' +
          `> ID do canal do erro: "${message.channel.id}"\n` +
          `> Erro: "${e}"`
        );
      });
  } else dm();

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando que foi mal utilizado por um usuário!\n' +
              `> ID do canal do erro: "${message.channel.id}"\n` +
              `> Erro: "${e}"`
            );
          });;

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um problema ao enviar um aviso de falta de parâmetros para a DM de um usuário!\n' +
          `> Usuário: ${message.author.tag} \`${message.author.id}\`\n` +
          `> Erro: "${e}"`
        );
      });
  };
};