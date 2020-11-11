const client = require('../..');
const moment = require('moment');
const { notFoundUser, notFoundServer, notify, notifyError, apiError } = require('./src/warnings');
const api = require('../../services/api');

let stts = true;

module.exports = () => {
  if (stts) {
    setInterval(() => {
      verificationValidity();
    }, 50000);
    stts = false;
  };
};

function verificationValidity() {
  const { apiAuthToken } = require('../../config/auth.json');

  api.get('/inventory', { body: { joinProducts: true }, headers: { Authorization: `Bearer ${apiAuthToken}` } })
    .then(response => {
      const vencidos = response.data.filter(item => {
        const characteristics = item.characteristics;

        return characteristics && characteristics.validity && Date.now() - item.timestamp > characteristics.validity;
      });
      const ids = vencidos.map(item => item.ID);

      api.delete('/inventory/delete', { body: { properties: { id: ids } } })
        .then(() => {
          vencidos.forEach(item => {
            const user = client.users.cache.get(item.user);
            const server = item.server ? client.guilds.cache.get(item.server) : false;
            const purchaseDate = moment(item.timestamp).locale('pt-br').format('L');
            const expirationDate = moment(item.timestamp + item.characteristics.validity).locale('pt-br').format('L');

            if (!user) return notFoundUser(item);
            if (server === undefined) return notFoundServer(item);

            notify(user, item, purchaseDate, expirationDate, server)
              .catch(e => notifyError(item, e));
          });
        }, e => apiError(ids, e));
    });
};

