const { comprasJoinProducts, client } = require('../../functions');
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
  const { locais, globais } = await comprasJoinProducts();
  const vencimentosLocais = locais.filter(compra => compra.p_validade && Date.now() - compra.momento_compra > compra.p_validade);
  const vencimentosGlobais = globais.filter(compra => compra.p_validade && Date.now() - compra.momento_compra > compra.p_validade);
  const idsLocais = vencimentosLocais.map(compra => compra.id);
  const idsGlobais = vencimentosGlobais.map(compra => compra.id);

  // Vencimento de compras locais
  if(idsLocais.length !== 0) {
    try {
      await api.delete('/localPurchases/bulkDelete', { body: { ids: idsLocais } });
    } catch (e) {
      return apiError('locais', idsLocais, e);
    }

    vencimentosLocais.forEach(compra => {
      const user = client.users.cache.get(compra.user_id);
      const server = client.guilds.cache.get(compra.server_id);
      const purchaseDate = moment(compra.timestamp).locale('pt-br').format('L');
      const expirationDate = moment(compra.timestamp + compra.p_validity).locale('pt-br').format('L');
  
      if (!user) return notFoundUser(compra);
  
      if (!server) return notFoundServer(compra);
  
      try {
        notify(user, compra, purchaseDate, expirationDate, server);
      } catch (e) {
        notifyError(compra, e);
      };
    });
  };

  // Vencimentos de compras globais
  if(idsGlobais.length !== 0) {
    try {
      await api.delete('/globalPurchases/bulkDelete', { body: { ids: idsGlobais } });
    } catch (e) {
      return apiError('globais', idsGlobais, e);
    }

    vencimentosGlobais.forEach(compra => {
      const user = client.users.cache.get(compra.user_id);
      const purchaseDate = moment(compra.timestamp).locale('pt-br').format('L');
      const expirationDate = moment(compra.timestamp + compra.p_validity).locale('pt-br').format('L');
  
      if (!user) return notFoundUser(compra);
  
      try {
        notify(user, compra, purchaseDate, expirationDate);
      } catch (e) {
        notifyError(compra, e);
      };
    });
  };
};

