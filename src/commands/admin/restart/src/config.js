const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "restart",
  aliases: ["reiniciar"],
  type: "Admin",
  description: 'Esse é um comando exclusivo para o uso de administradores do bot, sua função é: Reiniciar a instância do bot.',
  how_to_use: `Digite ${prefix}restart no chat e e aguarde a resposta do bot com um pedido de confirmação, caso queira pular a parte de confirmação, passe "Y" ou "S" como parâmetro.`,
  example: `${prefix}restart Y`,
  example_url: null,
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1608383577052,
  updated_timestamp: 1608474418718,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Restarta o bot após a confirmação direta ou indireta do usuário',
      timestamp: 1608383577052
    }
  }
};

