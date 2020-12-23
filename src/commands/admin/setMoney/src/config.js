const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "setmoney",
  aliases: ["setardinheiro"],
  type: "Admin",
  description: 'Seta um valor específico de money para o membro que foi mencionado. (O valor passado como parâmetro substituirá o valor antigo que o membro possuia)',
  how_to_use: `Digite ${prefix}setmoney no chat e passe como parâmetro o membro que receberá o dinheiro e também o novo valor que será setado.`,
  example: `${prefix}setmoney @Membro 200`,
  example_url: null,
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1599255780000,
  updated_timestamp: 1608545925594,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Seta o valor de money de algum membro do servidor em que o comando está sendo utilizado.',
      timestamp: 1599255780000
    }
  }
};