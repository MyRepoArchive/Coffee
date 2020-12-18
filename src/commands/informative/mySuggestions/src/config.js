const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "mysuggestions",
  aliases: ["minhassugestoes"],
  type: 'Informativo',
  description: `É utilizado para ver as sugestões que o usuário fez, saber seus IDs e status.`,
  how_to_use: `Envie ${prefix}mysuggestions no chat e aguarde a resposta do bot com os as suas sugestões em uma embed. Você também pode passar o ID de alguma das suas sugestões como parâmetro do comando, caso o bot encontre alguma sugestão seu com esse id, ele mostra apenas aquela sugestão, caso não encontre, vai mostrar todas as sugestões que você já fez.`,
  example: `${prefix}mysuggestions 83`,
  example_url: 'https://imgur.com/GWr4MH8.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1608321199671,
  updated_timestamp: 1608321302345,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Mostra uma embed paginada com todas as sugestões que o usuário já fez. Também pode mostrar uma única sugestão, se o usuário passar o ID dela como parâmetro',
      timestamp: 1608321302345
    }
  }
};