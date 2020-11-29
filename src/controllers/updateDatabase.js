const { db } = require('../utils/connectDb');
const client = require('..');
const { log } = require('../config/default.json');
const moment = require('moment');

setInterval(() => {
  db.ref('/').set(cache);

  console.log(cache);

  client.channels.cache.get(log).send({ files: [{ name: `database_coffee_${moment().locale('pt-br').format()}.json`, attachment: Buffer.from(JSON.stringify(cache, null, 2)) }] })
}, 60000);