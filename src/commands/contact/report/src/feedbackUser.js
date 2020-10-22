const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const client = require('../../../..');

module.exports = (status, message) => {
  if (!message) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
    '> A função "feedbackUser" está sendo chamada sem o parâmetro "message" que é essencial para o correto funcionamento da mesma.\n'+
    `> Path: "${__filename}"`
  );

  if (!status) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n\n`+
      '> A função "feedbackUser" está sendo chamada sem o parâmetro "status".\n'+
      `> Path: "${__filename}"`
    );
    status = 'EM ANALISE'
    return;
  }

  const msg = 
    `> ${emoji.emojicoffeecheck} Check!\n\n`+
    '> Seu report foi enviado para os administradores, eles irão verificar se é válido e irão corrigir o mais rápido possível. Obrigado!\n'+
    `> Status: "${status}"`

  const permissions = message.channel.permissionsFor(client.user);

  if (permissions.has('SEND_MESSAGES')) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um erro ao enviar um check.\n' +
          `> ID do canal do erro: "${message.channel.id}"\n` +
          `> Erro: "${e}"`
        );
      })
  } else dm();

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeecheck)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando.\n'+
              `> ID do canal do erro: "${message.channel.id}"\n`+
              `> Erro: "${e}"`
            );
          });;

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n\n` +
          '> Houve um problema ao enviar um check para a DM de um usuário!\n'+
          `> Usuário: ${message.author.tag} \`${message.author.id}\`\n`+
          `> Erro: "${e}"`
        );
      });
  };
};