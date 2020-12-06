const express = require('express');
const admin = require('./middlewares/admin');
const routes = express.Router();

routes.post('/auth', require('./controllers/auth'));

routes.use(admin);

routes.post('/activities/time', require('./controllers/activities/setTime'));

module.exports = routes;