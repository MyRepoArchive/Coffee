import express from 'express';
import cors from 'cors';
import { start } from './src/functions/connectDb';
import routes from './src/api/routes'

const app = express();
app.use(express.json());
app.use(cors());

start().then(() => {
  import('./src');

  app.use('/api', routes);


  module.exports = app.listen(3001, '', () => console.log('Servidor ligado'));
});