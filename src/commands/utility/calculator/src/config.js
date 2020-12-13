const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "calculator",
  aliases: ["calculadora", "calcular", 'calc', 'math', 'calculate'],
  type: 'Utilidade',
  description: 'Faz calculos matemáticos simples e complexos, o que facilita para o usuário que quer fazer uma conta rápida e não quer sair do aplicativo do Discord. O comando calculator tem a funcionalidade de identificar uma expressão matemática no chat mesmo sem o uso de nenhum prefixo nem comando, e com isso consegue ser mais eficaz.',
  how_to_use: 'Apenas envie a expressão matemática no chat e aguarde a resposta do bot, se ele não responder significa se não conseguiu resolver, ou por problemas de performançe ou porque sua expressão está incorreta. Você também pode usar a calculadora como um comando normal utilizando o prefixo e o nome do comando antes de fazer a expressão!',
  example: `${prefix}calculator 1+1`,
  example_url: 'https://imgur.com/Qd3DbnC.png',
  cooldown: 0,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1598742360000,
  updated_timestamp: 1607888865732,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Faz os calculos normalmente com e sem comando.',
      timestamp: 1607612559407
    }
  }
};