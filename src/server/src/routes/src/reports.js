const express = require('express');
const routes = express.Router();
const ReportsController = require('../../controllers/ReportsController');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

routes.use(auth);

routes.put('/create', ReportsController.create);

routes.use(admin);

routes.get('/', ReportsController.all);
routes.get('/:id', ReportsController.get);
routes.post('/update', ReportsController.update);

module.exports = routes;