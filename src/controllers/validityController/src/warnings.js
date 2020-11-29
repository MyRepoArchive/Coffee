const { error, apiError } = require('../../../functions');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = {
  notFoundUser(item) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O usuário não foi encontrado!\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user_id}"\n`+
      `> O produto: ${item.product.name} \`${item.product.id}\``
    );
  },

  notFoundServer(item) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O Servidor no qual o usuário comprou o item não foi encontrado!\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user_id}"\n`+
      `> O ID do servidor: "${item.guild_id}"\n`+
      `> O produto: ${item.product.name} \`${item.product.id}\``
    );
  },

  notify: (user, item, purchaseDate, expirationDate, server) => new Promise((resolve, reject) => {
    user.send(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      `> Olá Sr.${user.username}, informamos que seu **${item.products.name}** com validade para **${item.product.validity / 86400000} dias**${server ? `, adquirido no servidor **${server.name}**,` : ''} venceu. Ele estará sendo retirado de sua conta neste instante.\n`+
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
      `> O ID do usuário: "${item.user_id}"\n`+
      `> O produto: ${item.product.name} \`${item.product.id}\`\n`+
      `> O erro: "${JSON.stringify(e, null, 4)}"`
    );
  }
};