const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "help",
  aliases: ["ajuda", "comandos", "commands"],
  type: 'Utilidade',
  description: 'O comando help serve para mostrar todos os comandos disponíveis do bot, sejam eles de forma abrangente ou detalhada.',
  how_to_use: `Envie ${prefix}help no chat e aguarde a resposta com todos os comandos divididos por categoria. Se quiser fazer uma filtragem apenas por uma determinada categoria, use ${prefix}help <categoria>, e se quiser ver detalhes de um determinado comando basta usar ${prefix}help <comando>.`,
  example: `${prefix}help sugerir`,
  example_url: 'https://imgur.com/gHWSRjJ.png',
  cooldown: 3000,
  cooldownControl: {},
  times_limit: 2,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1597006800000,
  updated_timestamp: 1608475469631,
  version: '1,0',
  releases_notes: {
    '0,1': {
      v: '0,1',
      name: 'Listagem de comandos',
      description: 'Lista todos os comandos do bot, sem muitos detalhes!',
      timestamp: 1607471065082
    },
    '1,0': {
      v: '1,0',
      name: 'Todos os comandos listados + detalhes',
      description: 'Ao utilizar o comando help sem nenhum parâmetro na frente, ele agora envia uma embed com todos os comandos, divididos por categorias. Ao colocar algum parâmetro à frente do comando, ele busca primeiramente um comando condizente com aquele parâmetro, caso encontre ele envia uma embed com detalhes do comando, caso não encontre, ele busca uma categoria de comandos equivalente, se houver, envia uma embed com todos os comandos e seus determinados aliases daquela categoria. Caso não encontre nenhum dos dois, responde o equivalente a não ter passado parâmetro algum.',
      timestamp: 1607545326113
    }
  }
};