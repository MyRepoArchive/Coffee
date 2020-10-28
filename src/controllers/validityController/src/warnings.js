const { error, apiError } = require('../../../functions');
const { static: { emoji } } = require('../../../utils/emojis.json');

module.exports = {
  notFoundUser(compra) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O usuário não foi encontrado!\n'+
      `> O ID do usuário: "${compra.user_id}"\n`+
      `> O produto: ${compra.p_name} \`${compra.p_id}\``
    );
  },

  notFoundServer(compra) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O Servidor no qual o usuário comprou o item não foi encontrado!\n'+
      `> O ID do usuário: "${compra.user_id}"\n`+
      `> O ID do servidor: "${compra.server_id}"\n`+
      `> O produto: ${compra.p_name} \`${compra.p_id}\``
    );
  },

  notify: (user, compra, purchaseDate, expirationDate, server) => new Promise((resolve, reject) => {
    user.send(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      `> Olá Sr.${user.username}, informamos que seu **${compra.p_name}** com validade para **${compra.p_validity / 86400000} dias**${server ? `, comprado no servidor **${server.name}**,` : ''} venceu. Ele estará sendo retirado de sua conta neste instante.\n`+
      '> Agradeçemos a compreensão.\n'+
      `> Data da compra: \`${purchaseDate}\`\n`+
      `> Data de vencimento: \`${expirationDate}\``
    )
      .then(() => resolve())
      .catch(e => reject(e));
  }),

  notifyError(compra, e) {
    error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Aconteceu um problema ao enviar a notificação de vencimento de produto para um dos usuários.\n'+
      `> O ID do usuário: "${compra.user_id}"\n`+
      `> O produto: ${compra.p_name} \`${compra.p_id}\`\n`+
      `> O erro: "${apiError(e)}"`
    );
  },

  apiError(type, ids, e) {
    error(
      `> ${emoji.emojicoffeeerro} Erro\n`+
      `> Aconteceu um problema ao fazer a requisição de deletar as compras ${type} para a api.\n`+
      `> Os IDs das compras: ${ids}\n`+
      `> O erro: "${apiError(e)}"`
    );
  }
};