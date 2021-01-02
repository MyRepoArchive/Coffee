const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "addmoney",
  aliases: ["adicionardinheiro"],
  type: "Admin",
  description: 'Adiciona um valor de money para o membro que foi mencionado. (O valor passado como parâmetro não substituirá o valor antigo que o membro possuia, apenas se somará a ele)',
  how_to_use: `Digite ${prefix}addmoney no chat e passe como parâmetro o membro que receberá o dinheiro e também o valor que será somado`,
  example: `${prefix}addmoney @Membro 200`,
  example_url: null,
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1609592708899,
  updated_timestamp: 1609593216105,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Adiciona em money do membro o valor passado pelo usuário.',
      timestamp: 1609592708899
    }
  }
};