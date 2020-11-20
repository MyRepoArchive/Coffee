const client = require('../../../..');
const { static: { emoji, eID } } = require('../../../../utils/emojis.json');

module.exports = (message) => {
  const { error } = require('../../../../functions');
  
  if (!message) return error(
    `> ${emoji.emojicoffeeinfo} Aviso!\n`+
    '> A função "suggestionError" está sendo chamada sem o parâmetro "message" que é essencial para o correto funcionamento da mesma.\n'+
    `> Path: "${__filename}"`
  );

  const msg =
    `> ${emoji.emojicoffeeerro} Erro!\n`+
    '> Houve um erro ao criar a sua suggestion, nossa equipe será notificada e se necessário entrará em contato.\n'+
    '> Status: "NÃO CRIADO"'

  const permissions = message.channel.permissionsFor(client.user);

  if (permissions.has('SEND_MESSAGES')) {
    message.channel.send(msg)
      .catch(e => {
        dm();

        error(
          `> ${emoji.emojicoffeeinfo} Aviso!\n` +
          '> Houve um erro ao enviar um aviso que um comando não havia funcionado da maneira esperada.\n' +
          `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
          `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
          `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
          `> Path: "${__filename}"\n` +
          `> Erro: "${JSON.stringify(e, null, 4)}"`
        );
      })
  } else dm();

  function dm() {
    message.author.send(msg)
      .catch(e => {
        if (permissions.has("ADD_REACTIONS")) message.react(eID.emojicoffeeerro)
          .catch(e => {
            error(
              `> ${emoji.emojicoffeeinfo} Aviso!\n` +
              '> Houve um problema ao tentar adicionar uma reação em um comando que não teve a resposta esperada!\n' +
              `> Servidor: "${message.guild.name}" \`${message.guild.id}\`\n` +
              `> Canal: "${message.channel.name}" \`${message.channel.id}\`\n` +
              `> Usuário: "${message.author.tag}" \`${message.author.id}\`\n` +
              `> Path: "${__filename}"\n` +
              `> Erro: "${JSON.stringify(e, null, 4)}"`
            );
          });
      });
  };
};