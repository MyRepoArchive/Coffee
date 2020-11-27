const express = require('express');
const routes = express.Router();
const CommandsController = require('../../controllers/CommandsController');
const admin = require('../../middlewares/admin');

routes.get('/', CommandsController.all);
routes.get('/:id', CommandsController.get);

routes.use(admin);

routes.put('/create', CommandsController.create);
routes.post('/update', CommandsController.update);
routes.delete('/delete', CommandsController.delete);

module.exports = routes;