const client = require("..");
const { backup } = require('../config/default.json');
const error = require("./error");
const { static: { emoji } } = require('../utils/emojis.json');
const moment = require('moment');

module.exports = () => {
  setInterval(() => {
    client.channels.fetch(backup).then(channel => {
      const name = `backup_${moment().locale('pt-br').format('llll')}.json`;
      const attachment = Buffer.from(JSON.stringify(client.db.cache, null, 2));
  
      channel.send({ files: [{ name, attachment }] }).catch(e => error(
        `> ${emoji.emojicoffeeerro} Erro!\n` +
        '> Houve um erro ao enviar o backup do banco de dados!\n' +
        `> Path: "${__filename}"\n` +
        `> Error: "${JSON.stringify(e, null, 2)}"`
      ));
    }, e => error(
      `> ${emoji.emojicoffeeinfo} Aviso\n` +
      `> Não foi possível encontrar o canal cadastrado para envio dos backups do banco de dados!\n` +
      `> ID: "${backup}"\n` +
      `> Path: "${__filename}"\n` +
      `> Erro: "${JSON.stringify(e, null, 4)}"`
    ));
  }, 3600000); // A cada uma hora ele faz um backup
};