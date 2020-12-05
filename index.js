const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

module.exports = app;

require('./src/functions/connectDb').start().then(() => {
  require('./src');

  app.listen(3001, '', () => console.log('Servidor ligado'));
});