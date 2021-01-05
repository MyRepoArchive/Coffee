const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "saldo",
  aliases: ["money", "dinheiro", "ccoins", "balanco", "balanco", "balance"],
  type: "Economia",
  description: 'Veja quanto você possui de CCoins a qualquer momento, isto inclui o que possui em mãos (valor válido apenas no servidor em questão) e quanto possui no banco (valor válido para todo o Discord).',
  how_to_use: `Envie ${prefix}saldo no chat e aguarde a resposta do bot.`,
  example: `${prefix}saldo`,
  example_url: 'https://imgur.com/Caifa22.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 2,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1599083803000,
  updated_timestamp: 1609845476758,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Mostra o saldo do usuário no chat.',
      timestamp: 1599083803000
    },
    '1,1': {
      v: '1,1',
      name: 'Saldo em imagem',
      description: 'Gera uma imagem formatada com o saldo do usuário, e sua imagem de perfil',
      timestamp: 1609845076973
    }
  }
};

