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

async function verificationValidity() {
  const { comprasJoinProducts } = require('../../functions');

  const { locais, globais } = await comprasJoinProducts();
  const vencimentosLocais = locais.filter(compra => compra.p_validade && Date.now() - compra.momento_compra > compra.p_validade);
  const vencimentosGlobais = globais.filter(compra => compra.p_validade && Date.now() - compra.momento_compra > compra.p_validade);
  const idsLocais = vencimentosLocais.map(compra => compra.id);
  const idsGlobais = vencimentosGlobais.map(compra => compra.id);

  // Vencimento de compras locais
  if (idsLocais.length !== 0) {
    api.delete('/localPurchases/bulkDelete', { body: { ids: idsLocais } })
      .then(() => {
        vencimentosLocais.forEach(compra => {
          const user = client.users.cache.get(compra.user_id);
          const server = client.guilds.cache.get(compra.server_id);
          const purchaseDate = moment(compra.timestamp).locale('pt-br').format('L');
          const expirationDate = moment(compra.timestamp + compra.p_validity).locale('pt-br').format('L');

          if (!user) return notFoundUser(compra);
          if (!server) return notFoundServer(compra);

          notify(user, compra, purchaseDate, expirationDate, server)
            .catch(e => notifyError(compra, e));
        });
      }, e => apiError('locais', idsLocais, e));
  };

  // Vencimentos de compras globais
  if (idsGlobais.length !== 0) {
    await api.delete('/globalPurchases/bulkDelete', { body: { ids: idsGlobais } })
      .then(() => {
        vencimentosGlobais.forEach(compra => {
          const user = client.users.cache.get(compra.user_id);
          const purchaseDate = moment(compra.timestamp).locale('pt-br').format('L');
          const expirationDate = moment(compra.timestamp + compra.p_validity).locale('pt-br').format('L');

          if (!user) return notFoundUser(compra);

          notify(user, compra, purchaseDate, expirationDate)
            .catch(e => notifyError(compra, e));
        });
      }, e => apiError('globais', idsGlobais, e));
  };
};

