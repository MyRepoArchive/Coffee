const api = require('../services/api');
const { activities } = require('../utils/cache');
const cache = require('../utils/cache');

async function Activities() {
  console.log('cache');

  if (cache.activities.length > 0) {
    return cache.activities;
  } else {
    return await getActivities();
  }
};

async function getActivities() {
  console.log('api');
  console.log(cache);
  const response = await api.get('/activities');
  cache[activities] = response.data;
  cache.activities.push(response.data)
  return response.data
};

module.exports = Activities;