const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

module.exports.app = app;

global.cache = {};
require('./src/utils/connectDb');

require('./src/routes');

const start = () => new Promise((resolve, reject) => {
  app.listen(3001, '', () => {
    console.log('Servidor ligado');
    resolve()
  });
});

module.exports.start = start;