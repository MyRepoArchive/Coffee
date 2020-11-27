const express = require('express');
const routes = express.Router();
const CacheController = require('../../controllers/CacheController');
const admin = require('../../middlewares/admin');

routes.use(admin);

routes.get('/', CacheController.all);
routes.get('/:property', CacheController.get);
routes.post('/refresh', CacheController.refresh);

module.exports = routes;