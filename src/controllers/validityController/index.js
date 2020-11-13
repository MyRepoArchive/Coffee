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
    verificationValidity();
    stts = false;
  };
};

function verificationValidity() {
  api.get('/inventory', { params: { joinProducts: true } })
    .then(response => {
      const vencidos = response.data.filter(item => {
        const characteristics = JSON.parse(item.characteristics);

        return characteristics && characteristics.validity && Date.now() - item.TIMESTAMP > characteristics.validity;
      });
      const ids = vencidos.map(item => item.ID);

      if (ids.length) {
        api.delete('/inventory/delete', { params: { properties: { id: ids } } })
        .then(() => {
          vencidos.forEach(item => {
            const user = client.users.cache.get(item.user);
            const server = item.server ? client.guilds.cache.get(item.server) : false;
            const purchaseDate = moment(item.TIMESTAMP).locale('pt-br').format('L');
            const expirationDate = moment(item.TIMESTAMP + item.characteristics.validity).locale('pt-br').format('L');

            if (!user) return notFoundUser(item);
            if (server === undefined) return notFoundServer(item);

            notify(user, item, purchaseDate, expirationDate, server)
              .catch(e => notifyError(item, e));
          });
        }, e => apiError(ids, e));
      };
    });
};

