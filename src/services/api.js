const axios = require('axios');
const { apiBaseURL } = require('../config/auth.json');

const api = axios.create({ baseURL: apiBaseURL });

module.exports = api;