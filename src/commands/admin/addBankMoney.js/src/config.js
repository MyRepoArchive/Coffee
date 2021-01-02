const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "addbankmoney",
  aliases: ["adicionardinheironobanco"],
  type: "Admin",
  description: 'Adiciona um valor de money para o usuário que foi mencionado. (O valor passado como parâmetro não substituirá o valor antigo que o usuário possuia, apenas se somará a ele)',
  how_to_use: `Digite ${prefix}addbankmoney no chat e passe como parâmetro o usuário que receberá o dinheiro e também o valor que será somado`,
  example: `${prefix}addbankmoney @Usuário 200`,
  example_url: null,
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1609593202390,
  updated_timestamp: 1609594910700,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Adiciona em money do usuário o valor passado pelo utilizador do comando.',
      timestamp: 1609593202390
    }
  }
};