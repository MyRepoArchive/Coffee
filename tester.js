const bcrypt = require('bcryptjs');

console.log(bcrypt.hash('teste', 10).then(pass => console.log(pass)))