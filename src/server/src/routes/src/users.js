const express = require('express');
const routes = express.Router();
const UsersController = require('../../controllers/UsersController');
const verifyAdminMiddleware = require('../../middlewares/admin');

routes.use(verifyAdminMiddleware);

routes.get('/', UsersController.index);
routes.get('/:id', UsersController.findById);

module.exports = routes;