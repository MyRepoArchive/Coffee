const client = require('../..');
const moment = require('moment');
const { notFoundUser, notFoundServer, notify, notifyError } = require('./src/warnings');
const joinProducts = require('./src/joinProducts');
const _delete = require('../delete');
const { static: { emoji } } = require('../../utils/emojis.json');

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

    if (!user) return notFoundUser(item);
    if (server === undefined) return notFoundServer(item);

    notify(user, item, purchaseDate, expirationDate, server)
      .catch(e => notifyError(item, e));
  });

  if (ids.length) {
    _delete(ids).catch(e => error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um erro ao deletar os itens vencidos do database!\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 2)}"` 
    ));
  };
};

