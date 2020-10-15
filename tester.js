const json = require('./teste.json');
console.log(JSON.stringify(json)+'\n');

json.oi = 'oi';

require('./tester2')();

console.log(json);