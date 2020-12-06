const client = require('../..');
const moment = require('moment');
const joinProducts = require('./inventoryJoinProducts');
const _delete = require('./delete');
const { static: { emoji } } = require('../../utils/emojis.json');
const error = require('../../functions/error');

let stts = true;

module.exports = () => {
  if (stts) {
    setInterval(() => {
      verificationValidity();
    }, 60000);
    verificationValidity();
    stts = false;
  };
};

function verificationValidity() {
  const vencidos = joinProducts().filter(item => {
    return item.product.validity && Date.now() - item.created_timestamp > item.product.validity;
  });
  const ids = vencidos.map(x => x.id);

  vencidos.forEach(item => {
    const user = client.users.cache.get(item.user_id);
    const server = item.guild_id ? client.guilds.cache.get(item.guild_id) : false;
    const purchaseDate = moment(item.created_timestamp).locale('pt-br').format('L');
    const expirationDate = moment(item.created_timestamp + item.product.validity).locale('pt-br').format('L');

    if (!user) return error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O usuário não foi encontrado!\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user_id}"\n`+
      `> O produto: ${item.product.name} \`${item.product.id}\``
    );
    if (server === undefined) return error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Houve um problema no momento de notificar um dos usuários sobre o vencimento de um de seus produtos. O Servidor no qual o usuário comprou o item não foi encontrado!\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user_id}"\n`+
      `> O ID do servidor: "${item.guild_id}"\n`+
      `> O produto: ${item.product.name} \`${item.product.id}\``
    );

    user.send(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      `> Olá Sr.${user.username}, informamos que seu **${item.product.name}** com validade para **${item.product.validity / 86400000} dias**${server ? `, adquirido no servidor **${server.name}**,` : ''} venceu. Ele estará sendo retirado de sua conta neste instante.\n`+
      '> Agradeçemos a compreensão.\n'+
      `> Data da compra: \`${purchaseDate}\`\n`+
      `> Data de vencimento: \`${expirationDate}\``
    ).catch(e => error(
      `> ${emoji.emojicoffeeinfo} Aviso\n`+
      '> Aconteceu um problema ao enviar a notificação de vencimento de produto para um dos usuários.\n'+
      `> Path: "${__filename}"\n` +
      `> O ID do usuário: "${item.user_id}"\n`+
      `> O produto: ${item.product.name} \`${item.product.id}\`\n`+
      `> O erro: "${JSON.stringify(e, null, 4)}"`
    ));
  });

  if (ids.length) _delete(ids);
};