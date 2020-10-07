module.exports = async () => {
  const comprasLocais = await require('../../controllers/ComprasLocaisController').comprasLocais();
  const comprasGlobais = await require('../../controllers/ComprasGlobaisController').comprasGlobais();
  const products = await require('../../controllers/ProductsController').products();

  const result = {
    locais: comprasLocais.map(compra => {
      const product = products.find(product => product.id === compra.productid);
  
      Object.keys(product).forEach((key, index) => {
        compra['p_' + key] = Object.values(product)[index];
      });
  
      return compra;
    }),

    globais: comprasGlobais.map(compra => {
      const product = products.find(product => product.id === compra.productid);
  
      Object.keys(product).forEach((key, index) => {
        compra['p_' + key] = Object.values(product)[index];
      });
  
      return compra;
    })
  }

  return result;
}