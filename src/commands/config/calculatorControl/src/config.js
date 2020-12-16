const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "calculatorcontrol",
  aliases: ["calccontrol", "controlcalc", "controlcalculator", "configcalc", "configcalculator", "calculatorconfig", "calcconfig"],
  type: 'Configurações',
  description: `Define qual/quais canais do servidor poderão ser utilizada a utilidade de calculadora automática do bot (por padrão todos os canais tem altorização para o uso da calculadora automática).`,
  how_to_use: `Envie ${prefix}calculatorcontrol no chat e aguarde a resposta do bot com a embed para continuar as configurações, ou se quiser economizar tempo, passe como parâmetro o que você deseja fazer. Pode ser: "ENABLE ALL" (para ativar a calculadora automática em todos os canais do servidor), "DISABLE ALL" (para desativar a calculadora automática em todos os canais do servidor), "ENABLE THIS" (para ativar a calculadora automática no canal em que está sendo executado o comando), "DISABLE THIS" (para desativar a calculadora altomática no canal em que está sendo executado o comando).`,
  example: `${prefix}calculatorcontrol ENABLE THIS`,
  example_url: 'https://imgur.com/Jv3Zma5.png',
  cooldown: 120000,
  cooldownControl: {},
  times_limit: 2,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1600014900000,
  updated_timestamp: 1608139887260,
  version: '1,2',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Altera as permissões do(s) canal(is) para a utilidade de calculadora altomática de acordo com o que o usuário pedir. Há quatro formas pré-definidas de alterar as permissões, sendo duas delas para retirar a permissão e duas para dar a permissão.',
      timestamp: 1607891736680
    },
    '1,1': {
      v: '1,1',
      name: 'Adm features e reactions',
      description: 'O bot verifica se pode adicionar reações naquele canal, caso possa, ele usar reactions com emojis personalizados e já faz uma pré-reação para ajudar o usuário, caso não consiga, ele coloca emojis padrão para o usuário reajir. Também foi adicionar algumas verificações para saber se quem está utilizando o comando é um admin do bot, se for duas novas opçoes são exibidas, essas novas opções afetam todas as guildas.',
      timestamp: 1608040372397
    },
    '1,1,1': {
      v: '1,1,1',
      name: 'Update performance',
      description: 'Antes de realmente atualizar os dados no banco de dados um bot faz uma rápida filtragem dos canais que vai fazer a requisição, sendo assim, modifica apenas o canais que tenham a permissão contrário à que foi solicitada pelo usuário, assim evitando um tráfego maior de dados.',
      timestamp: 1608112638153
    },
    '1,2': {
      v: '1,2',
      name: 'Nova field "Status"',
      description: 'Foi adicionada uma nova field na embed de resposta, que exibe o status de permissão nos canais do servidor e no canal em que foi dado o comando. Se o usuário for um administrador do bot, ele exibe uma linha mais, que mostra o status de todos os canais do bot',
      timestamp: 1608139887260
    }
  }
};