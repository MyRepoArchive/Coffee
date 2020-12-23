const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "restart",
  aliases: ["reiniciar"],
  type: "Admin",
  description: 'Esse é um comando exclusivo para o uso de administradores do bot, sua função é: Reiniciar a instância do bot.',
  how_to_use: `Digite ${prefix}restart no chat e e aguarde a resposta do bot com um pedido de confirmação.`,
  example: `${prefix}restart`,
  example_url: 'https://imgur.com/Fs6xAX8.png',
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
      description: 'Restarta o bot após a confirmação do usuário',
      timestamp: 1608383577052
    }
  }
};

