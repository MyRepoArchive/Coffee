const api = require('../services/api');
const cache = require('../utils/cache');

module.exports = {
  async activities() {
    if(cache.activities.length > 0) {
      return cache.activities;
    } else {
      return await this.getActivities();
    }
  },

  async getActivities() {
    const { data } = await api.get('/activities');

    this.saveDataInCache(data);

    return data;
  },

  saveDataInCache(data) {
    cache.activities = data;
    cache.apiReq++;
  }
};