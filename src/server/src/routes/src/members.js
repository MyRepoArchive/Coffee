const express = require('express');
const routes = express.Router();
const MembersController = require('../../controllers/MembersController');
const admin = require('../../middlewares/admin');

routes.use(admin);

routes.get('/', MembersController.all);
routes.get('/find', MembersController.find);
routes.get('/:id', MembersController.get);
routes.put('/create', MembersController.create);
routes.post('/update', MembersController.update);
routes.delete('/delete', MembersController.delete);

module.exports = routes;