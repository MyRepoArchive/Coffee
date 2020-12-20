const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "grau",
  aliases: ['empinar'],
  type: 'Diversão',
  description: `Empine sua motoca`,
  how_to_use: `Envie ${prefix}grau no chat e aguarde a magia.`,
  example: `${prefix}grau`,
  example_url: 'https://imgur.com/mLhjPjE.png',
  cooldown: 2000,
  cooldownControl: {},
  times_limit: 5,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1608333394447,
  updated_timestamp: 1608475097827,
  version: '1,1',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Envia mensagens de grau no chat',
      timestamp: 1608333394447
    },
    '1,1': {
      v: '1,1',
      name: 'Audio do randandan',
      description: 'Além da mensagem, envia um arquivo mp3 de audio também',
      timestamp: 1608378079476
    }
  }
};