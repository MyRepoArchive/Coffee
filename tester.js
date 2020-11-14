const api = require('./src/services/api');

async function a() {
  const commands = await api.get('/commands').catch(e => console.log('erro'));

  console.log(commands.data)
};

a()