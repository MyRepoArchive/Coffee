const express = require('express');
const cors = require('cors');
const { key } = require('../config/auth.json');
const { loadCommands } = require('../functions');

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send({ message: "Acesso negado!" });
  if (authorization !== key) return res.status(401).send({ message: "Acesso negado!" });

  next();
});

app.post('/bot/commands/update', (req, res) => loadCommands());

app.listen(3002, '', console.log('API Start'));

module.exports = app;