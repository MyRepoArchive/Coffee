const json = require('./teste.json');

module.exports = () => {
  console.log(JSON.stringify(json)+'\n');
  json.ola = 'olá';
};