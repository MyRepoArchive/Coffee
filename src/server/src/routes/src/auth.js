const express = require('express');
const routes = express.Router();
const AuthController = require('../../controllers/AuthController');

routes.post('/', AuthController.index);

module.exports = routes;