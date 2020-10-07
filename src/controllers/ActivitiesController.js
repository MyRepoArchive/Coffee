const api = require('../services/api');
let cacheActivities = [];

module.exports = {
  async activities() {
    console.log('cache');

    if (cacheActivities.length > 0) {
      return cacheActivities;
    } else {
      return await this.getActivities();
    }
  },

  async getActivities() {
    console.log('api');
    console.log(cacheActivities);
    const response = await api.get('/activities');
    cacheActivities = response.data;
    return response.data;
  },
};