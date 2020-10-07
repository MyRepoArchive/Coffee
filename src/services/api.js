const axios = require('axios');
const { apiBaseURL } = require('../utils/info.json');

const api = axios.create({
  baseURL: apiBaseURL
});

module.exports = api;