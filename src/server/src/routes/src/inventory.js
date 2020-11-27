const express = require('express');
const routes = express.Router();
const InventoryController = require('../../controllers/InventoryController');
const admin = require('../../middlewares/admin');
const auth = require('../../middlewares/auth');

routes.use(auth);

routes.get('/my', InventoryController.my);

routes.use(admin);

routes.get('/', InventoryController.all);
routes.get('/:id', InventoryController.get);
routes.put('/create', InventoryController.create);
routes.post('/update', InventoryController.update);
routes.delete('/delete', InventoryController.delete);

module.exports = routes;