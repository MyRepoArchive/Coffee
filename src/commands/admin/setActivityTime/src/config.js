const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "setactivitytime",
  aliases: ["settimeactivity"],
  type: "Admin",
  description: 'Seta o tempo de intervalo entre os activities do bot.',
  how_to_use: `Digite ${prefix}setactivitytime no chat e passe como parâmetro o tempo de intervalo, em milisegundos, dos activities do bot.`,
  example: `${prefix}setactivitytime 30000`,
  example_url: 'https://i.imgur.com/IR9wG6v.png',
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1608153170744,
  updated_timestamp: 1608154951171,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Verifica se o parâmetro passado é um número, se for, seta no banco de dados.',
      timestamp: 1608153170744
    }
  }
};

