const axios = require('axios');
const { key } = require('../config/auth.json');

const api = axios.create({ baseURL: 'http://localhost:3002/bot' });

api.interceptors.request.use((config) => {
  config.headers.Authorization = key;

  return config;
});

module.exports = api;