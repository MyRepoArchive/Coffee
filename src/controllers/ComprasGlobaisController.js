const api = require('../services/api');
const cache = require('../utils/cache');

module.exports = {
  async comprasGlobais() {
    if(cache.comprasGlobais.length > 0) {
      return cache.comprasGlobais;
    } else {
      return await this.getComprasGlobais(); 
    };
  },

  async getComprasGlobais() {
    const { data } = await api.get('/comprasGlobais');

    this.saveDataInCache(data);

    return data;
  },

  saveDataInCache(data) {
    cache.comprasGlobais = data;
    cache.apiReq++;
  }
}