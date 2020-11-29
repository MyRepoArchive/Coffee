const client = require('../..');
const moment = require('moment');
const { notFoundUser, notFoundServer, notify, notifyError, apiError, apiGetError } = require('./src/warnings');
const joinProducts = require('./src/joinProducts');

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

  vencidos.forEach(item => {
    const user = client.users.cache.get(item.user_id);
    const server = item.guild_id ? client.guilds.cache.get(item.guild_id) : false;
    const purchaseDate = moment(item.created_timestamp).locale('pt-br').format('L');
    const expirationDate = moment(item.created_timestamp + item.product.validity).locale('pt-br').format('L');

    cache.inventory[item.id] = null;

    if (!user) return notFoundUser(item);
    if (server === undefined) return notFoundServer(item);

    notify(user, item, purchaseDate, expirationDate, server)
      .catch(e => notifyError(item, e));
  });
};

