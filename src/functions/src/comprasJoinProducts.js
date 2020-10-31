const api = require('../../services/api');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = async () => {
  const { apiError, error } = require('..');

  const comprasLocais = await api.get('/localPurchases').catch(e => apiReqError('localPurchases', e)) ?
    (await api.get('/localPurchases')).data : [];

  const comprasGlobais = await api.get('/globalPurchases').catch(e => apiReqError('globalPurchases', e)) ?
    (await api.get('/globalPurchases')).data : [];

  const products = await api.get('/products').catch(e => apiReqError('products', e)) ?
    (await api.get('/products')).data : [];


  return {
    locais: comprasLocais.map(compra => {
      const product = products.find(product => product.id === compra.product_id);

      Object.keys(product).forEach((key, index) => {
        compra['p_' + key] = Object.values(product)[index];
      });

      return compra;
    }),

    globais: comprasGlobais.map(compra => {
      const product = products.find(product => product.id === compra.product_id);

      Object.keys(product).forEach((key, index) => {
        compra['p_' + key] = Object.values(product)[index];
      });

      return compra;
    })
  };

  function apiReqError(item, e) {
    error(
      `> ${emoji.emojicoffeeerro} Erro!\n` +
      `> Houve um problema ao fazer uma requisição das ${item} à API!!\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${apiError(e)}"`
    );
  };
};