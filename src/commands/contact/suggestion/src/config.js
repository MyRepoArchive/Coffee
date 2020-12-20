const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "sugerir",
  aliases: ["sugestao"],
  type: "Contato",
  description: 'Se você gostaria de ver alguma nova funcionalidade no bot que ainda não tenha, ou qualquer tipo de feature, basta usar o comando para que os devenvolvedores fiquem a par da sugestão e possa prontamente atender aos seus pedidos.',
  how_to_use: `Digite ${prefix}sugerir no chat e passe como parâmetro a sua sugestão, em seguida envie a mensagem.`,
  example: `${prefix}sugerir Eu gostaria de um comando que me trouxesse café na cama, PARA ONTEM!`,
  example_url: 'https://i.imgur.com/NOsKTDK.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 2,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1598663751000,
  updated_timestamp: 1608474952331,
  version: '2,0',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Envia a sugestão em um canal no Discord para os administradores acessarem, com o nome do usuário que criou para caso precise entrar em contato',
      timestamp: 1598663751000
    },
    '2,0': {
      v: '2,0',
      name: 'Code refactoring e melhoria de gestão',
      description: 'Comando refeito, agora com um sistema de gestão de sugestões mais aprimorado. O usuário que sugeriu é notificado quando o status muda e sabe se foi aceito ou rejeitado! A sugestão é colocada em um banco de dados, e recebe uma identificação única que é repassada para o usuário.',
      timestamp: 1606334927649
    }
  }
};

