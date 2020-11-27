const express = require('express');
const routes = express.Router();
const ServersController = require('../../controllers/ServersController');
const admin = require('../../middlewares/admin');

routes.use(admin);

routes.get('/', ServersController.all);
routes.get('/:id', ServersController.get);
routes.put('/create', ServersController.create);

module.exports = routes;