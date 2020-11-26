const { error, apiError } = require('../../../functions');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = {
  notFoundUser(item) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O usuário não foi encontrado!\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user}"\n`+
      `> O produto: ${item.name} \`${item.product}\``
    );
  },

  notFoundServer(item) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O Servidor no qual o usuário comprou o item não foi encontrado!\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user}"\n`+
      `> O ID do servidor: "${item.server}"\n`+
      `> O produto: ${item.name} \`${item.product}\``
    );
  },

  notify: (user, item, purchaseDate, expirationDate, server) => new Promise((resolve, reject) => {
    user.send(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      `> Olá Sr.${user.username}, informamos que seu **${item.name}** com validade para **${item.characteristics.validity / 86400000} dias**${server ? `, adquirido no servidor **${server.name}**,` : ''} venceu. Ele estará sendo retirado de sua conta neste instante.\n`+
      '> Agradeçemos a compreensão.\n'+
      `> Data da compra: \`${purchaseDate}\`\n`+
      `> Data de vencimento: \`${expirationDate}\``
    )
      .then(() => resolve(), e => reject(e))
  }),

  notifyError(item, e) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Aconteceu um problema ao enviar a notificação de vencimento de produto para um dos usuários.\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user}"\n`+
      `> O produto: ${item.name} \`${item.product}\`\n`+
      `> O erro: "${JSON.stringify(e, null, 4)}"`
    );
  },

  apiError(ids, e) {
    error(
      `> ${emoji.emojicoffeeerro} Erro\n`+
      `> Aconteceu um problema ao fazer a requisição de deletar itens do inventorio que estava vencidos para a api.\n`+
      `> Os IDs das items: ${JSON.stringify(ids, null, 4)}\n`+
      `> Path: "${__filename}"\n` +
      `> O erro: "${apiError(e)}"`
    );
  },

  apiGetError(e) {
    error(
      `> ${emoji.emojicoffeeerro} Erro\n` +
      `> Aconteceu um problema ao fazer a requisição do inventário para a API.\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: ${apiError(e)}`
    )
  }
};