const express = require('express');
const routes = express.Router();
const ChannelsController = require('../../controllers/ChannelsController');
const admin = require('../../middlewares/admin');

routes.use(admin);

routes.put('/create', ChannelsController.create);

module.exports = routes;