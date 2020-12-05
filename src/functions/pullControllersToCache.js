const fs = require('fs');

module.exports = () =>  {
  fs.readdirSync('./src/controllers', { withFileTypes: true }).filter(value => value.isDirectory()).forEach(value => {
    fs.readdirSync(`./src/controllers/${value.name}`).forEach(arq => require(`../controllers/${value.name}/${arq}`))
  });
};