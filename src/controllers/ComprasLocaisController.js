const api = require('../services/api');
const cache = require('../utils/cache');

module.exports = {
  async comprasLocais() {
    if(cache.comprasLocais.length > 0) {
      return cache.comprasLocais;
    } else {
      return await this.getComprasLocais(); 
    };
  },

  async getComprasLocais() {
    const { data } = await api.get('/comprasLocais');
  
    this.saveDataInCache(data);

    return data;
  },

  saveDataInCache(data) {
    cache.comprasLocais = data;
    cache.apiReq++;
  }
}