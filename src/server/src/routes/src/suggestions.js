const express = require('express');
const routes = express.Router();
const SuggestionsController = require('../../controllers/SuggestionsController');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

routes.use(auth);

routes.put('/create', SuggestionsController.create);

routes.use(admin);

routes.get('/', SuggestionsController.all);
routes.get('/:id', SuggestionsController.get);
routes.post('/update', SuggestionsController.update);

module.exports = routes;