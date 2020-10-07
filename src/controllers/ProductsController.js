const api = require('../services/api');
const cache = require('../utils/cache');

module.exports = {
  async products() {
    if(cache.products.length > 0) {
      return cache.products;
    } else {
      return await this.getProducts();
    };
  },

  async getProducts() {
    const { data } = await api.get('/products');

    this.saveDataInCache(data);

    return data;
  },

  saveDataInCache(data) {
    cache.products = data;
    cache.apiReq++;
  }
}