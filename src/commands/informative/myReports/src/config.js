const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "myreports",
  aliases: ["meusreports"],
  type: 'Informativo',
  description: `É utilizado para ver os reports que o usuário fez, saber seus IDs e status.`,
  how_to_use: `Envie ${prefix}myreports no chat e aguarde a resposta do bot com os os seus reports em uma embed. Você também pode passar o ID de algum de seus reports como parâmetro do comando, caso o bot encontre algum report seu com esse id, ele mostra apenas aquele report, caso não encontre, vai mostrar todos os reports que você já fez.`,
  example: `${prefix}myreports 104`,
  example_url: 'https://imgur.com/65I4qzN.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1608293595839,
  updated_timestamp: 1608475197039,
  version: '1,1',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Mostra uma embed paginada com todos os reports que o usuário já fez. Também pode mostrar um único report, se o usuário passar o ID do report como parâmetro',
      timestamp: 1608293989577
    },
    '1,1': {
      v: '1,1',
      name: 'Paginação melhorada',
      description: 'O sistema de paginação da embed que mostra report por report agora tem dois novos emojis, um deles avança direto para o ultimo item da lista, e o outro retrocede para o primeiro.',
      timestamp: 1608314290069
    }
  }
};