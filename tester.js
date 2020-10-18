const fs = require('fs');

setInterval(() => {
  fs.writeFileSync('./alo.js', fs.readFileSync('./src/index.js', { encoding: 'utf8' }));
}, 20000);