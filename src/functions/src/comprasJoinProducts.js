const api = require('../../services/api');

module.exports = async () => {
  const comprasLocais = (await api.get('/localPurchases')).data;
  const comprasGlobais = (await api.get('/globalPurchases')).data;
  const products = (await api.get('/products')).data;

  const result = {
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

  return result;
}