const express = require('express');
const routes = express.Router();
const ActivitiesController = require('../../controllers/ActivitiesController');
const admin = require('../../middlewares/admin');

routes.get('/', ActivitiesController.all);
routes.get('/:id', ActivitiesController.get);

routes.use(admin);

routes.put('/create', ActivitiesController.create);
routes.post('/update', ActivitiesController.update);
routes.delete('/delete', ActivitiesController.delete);

module.exports = routes;