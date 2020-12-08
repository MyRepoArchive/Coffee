const client = require("../..");
const changeActivity = require("./changeActivity");
const logger = require('../../functions/logger');
const { static: { emoji } } = require('../../utils/emojis.json');

module.exports = (newTime) => new Promise((resolve, reject) => {
  if (typeof newTime !== "number" || !isFinite(newTime)) 
    return reject(new Error('O parâmetro newTime deve ser um número!'));
  
  client.db.ref('activity_time').set(newTime).then(() => {
    changeActivity();

    logger(
      `> ${emoji.emojicoffeeinfo} Aviso!\n` +
      `> Foi setado um novo activity_time, de ${client.db.cache.activity_time} para ${newTime}!\n` +
      `> Path: "${__filename}"`      
    );

    client.db.cache.activity_time = newTime;

    return resolve(newTime);
  }, e => {
    reject(e);
  });
});