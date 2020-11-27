const express = require('express');
const routes = express.Router();
const ProductsController = require('../../controllers/ProductsController');

routes.get('/', ProductsController.index);
routes.get('/:id', ProductsController.findById);

module.exports = routes;