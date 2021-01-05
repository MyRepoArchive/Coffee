const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "filtercommands",
  aliases: ['filtrarcomandos'],
  type: "Admin",
  description: 'Com esse comando você filtra os comandos com algumas chaves pre-definidas; são elas: ACTIVE (para mostrar apenas os comandos ativos), INACTIVE (para mostrar apenas os comandos inativos), WITH_IMAGE (para mostrar apenas os comandos que possuem a propriedade "example_url"), WITHOUT_IMAGE (para mostrar apenas os comandos que não possuem a propriedade "example_url")',
  how_to_use: `Digite ${prefix}filtercommands no chat e passe como parâmetro o a chave de filtragem que deseja.`,
  example: `${prefix}filtercommands ACTIVE`,
  example_url: 'https://imgur.com/FCRouYZ.png',
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1609847747681,
  updated_timestamp: 1609849644023,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Mostra apenas os comandos filtrados pela chave passada pelo usuário (ACTIVE, INACTIVE, WITH_IMAGE, WITHOUT_IMAGE).',
      timestamp: 1609847829083
    }
  }
};

