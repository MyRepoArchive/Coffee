const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "commandlist",
  aliases: ["listacomandos", "listadecomandos"],
  type: 'Informativo',
  description: `Exibe em uma embed uma lista com o nome prímário de todos os comandos do bot!`,
  how_to_use: `Envie ${prefix}commandList no chat e aguarde a resposta do bot`,
  example: `${prefix}commandlist`,
  example_url: 'https://imgur.com/z1sJsIa.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1598301420000,
  updated_timestamp: 1608324457934,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Ao usar o comando o bot envia uma embed mostrando todos os nomes primários dos comandos.',
      timestamp: 1598301420000
    },
    '1,1': {
      v: '1,1',
      name: 'Embed com paginação',
      description: 'A embed agora conta com sistema de paginação para que caso os comandos ocupem mais de 2048 caracteres, ele divide em mais partes.',
      timestamp: 1608324457934
    }
  }
};