const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "setprefix",
  aliases: ["setarprefixo", "alterarprefix", "alterarprefixo", "alterprefix", "alterprefixo", "changeprefix", "changeprefixo"],
  type: 'Configurações',
  description: `Mude o meu prefixo em algum servidor que você tenha permissão de gerenciar servidor ou administrador (por padrão meu prefixo é ${prefix} )`,
  how_to_use: 'Digite _setprefix e coloque como parâmetros o prefixo que deve ser setado, com no máximo 10 caracteres (se houverem espaços, apenas o primeiro de um segmento de dois ou mais espaços será considerado), e em seguida envie a mensagem. Caso queira setar o prefixo padrão do bot, envie apenas _setprefix',
  example: '_setprefix +',
  example_url: 'https://imgur.com/iIzTOKM.png',
  cooldown: 30000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1598998320000,
  updated_timestamp: 1607612559407,
  version: '1,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Seta o prefixo no servidor em que foi dado o comando, o prefixo pode ter até 10 caracteres e se houverem espaços apena o primeiro de uma sequencia será identificado. Conta também com uma opção para retornar para o prefixo padrão do bot.',
      timestamp: 1607612559407
    }
  }
};