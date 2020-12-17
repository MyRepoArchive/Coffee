const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "ping",
  aliases: ["latencia", "lag", "latency"],
  type: 'Informativo',
  description: `O ping é utilizado para saber se eu estou na ativa e saber quanto tempo eu demoro para responder minhas solicitações.`,
  how_to_use: `Envie ${prefix}ping no chat e aguarde a resposta do bot com os meus valores de latência. Se desejar saber apenas um dos valores, você pode passar alguns parâmetros na frente do comando, como "BOT" (para saber apenas o ping do bot), "API" (para saber apenas o ping da API) e "DATABASE" (para saber apenas o ping do banco de dados).`,
  example: `${prefix}ping API`,
  example_url: null,
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1596403980000,
  updated_timestamp: 1608231954528,
  version: '1,2',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Exibe a latência do bot e também a latência da API',
      timestamp: 1596403980000
    },
    '1,1': {
      v: '1,1',
      name: 'Ping do database',
      description: 'Além de mostrar valores de latência do bot e da API, mostra também valores do banco de dados.',
      timestamp: 1608198507512
    },
    '1,2': {
      v: '1,2',
      name: 'Pings separados',
      description: 'Foi adicionada a opçao de saber os valores de ping de apenas uma propriedade, apenas passando alguns parâmetros na frente do comando.',
      timestamp: 1608202358312
    }
  }
};