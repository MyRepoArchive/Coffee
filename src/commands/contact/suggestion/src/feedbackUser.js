const { static: { emoji, eID } } = require('../../../../utils/emojis.json');
const client = require('../../../..');

module.exports = (status, message, id) => {
  const { error } = require('../../../../functions');

  if (!message) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n`+
    '> A função "feedbackUser" está sendo chamada sem o parâmetro "message" que é essencial para o correto funcionamento da mesma.\n'+
    `> Path: "${__filename}"`
  );

  if (!status) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso!\n`+
      '> A função "feedbackUser" está sendo chamada sem o parâmetro "status".\n'+
      `> Path: "${__filename}"`
    );
    status = 'EM ANALISE'
    return;
  }

  const msg = 
    `> ${emoji.emojicoffeecheck} Check!\n`+
    '> Sua sugestão foi enviada para os administradores, eles irão verificar e ver se aceitam ou não. Obrigado!\n'+
    `> ID da suggestion: "${id}"\n` +
    `> Status: "${status}"`

  const permissions = message.channel.permissionsFor(client.user);

  if (permissions.has('SEND_MESSAGES')) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Houve um erro ao enviar um check.\n' +
          `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
          `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
          `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
          `> Path: "${__filename}"\n`+
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        );
      });
  } else dm();

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeecheck)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando.\n'+
              `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
              `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
              `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
              `> Path: "${__filename}"\n`+
              `> Erro: "${JSON.stringify(e, null, 4)}"`
            );
          });
      });
  };
};