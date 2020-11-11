const axios = require('axios');
const jwt = require('jsonwebtoken');
const { apiBaseURL, secret } = require('../config/auth.json');
const client = require('..');

const api = axios.create({ baseURL: apiBaseURL });

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${jwt.sign({ id: client.user.id }, secret)}`;

  return config;
});

module.exports = api;