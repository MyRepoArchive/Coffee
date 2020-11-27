const express = require('express');
const routes = express.Router();
const RegisterController = require('../../controllers/RegisterController');
const admin = require('../../middlewares/admin');

routes.use(admin);

routes.post('/', RegisterController.index);

module.exports = routes;