const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "drift",
  aliases: ['driftar', 'mandarodebanda'],
  type: 'Diversão',
  description: `Faça drift como nos velozes e furiosos!`,
  how_to_use: `Envie ${prefix}drift no chat e aguarde a magia.`,
  example: `${prefix}drift`,
  example_url: 'https://imgur.com/F7ehu0f.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 5,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1609846435464,
  updated_timestamp: 1609847146520,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Envia um gif aleatório de carros fazendo drift',
      timestamp: 1609846574677
    },
  }
};