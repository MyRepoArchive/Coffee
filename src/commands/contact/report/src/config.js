const { prefix } = require('../../../../config/default.json');

module.exports = {
  name: "report",
  aliases: ["reportar"],
  type: "Contato",
  description: 'Se você encontrou algum bug ou coisa que você acredita que não esteja funcionando como deveria, basta usar o comando para que os devenvolvedores fiquem a par do problema e o resolva.',
  how_to_use: `Digite ${prefix}report no chat e passe como parâmetro o seu report, em seguida envie a mensagem.`,
  example: `${prefix}report Encontrei um bug ao executar o comando ajuda, ao usar o comando o bot não responde!`,
  example_url: 'https://i.imgur.com/JYECykB.png',
  cooldown: 10000,
  cooldownControl: {},
  times_limit: 2,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1598646020000,
  updated_timestamp: 1608474915206,
  version: '2,1',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Envia report em um canal no Discord para os administradores acessarem, com o nome do usuário que criou para caso precise entrar em contato',
      timestamp: 1598646020000
    },
    '2,0': {
      v: '2,0',
      name: 'Code refactoring e melhoria de gestão',
      description: 'Comando refeito, agora com um sistema de gestão de reports mais aprimorado. O usuário que fez o report é notificado quando o status do seu report muda, sabe se foi aceito ou rejeitado, e caso aceito, sabe quando foi solucionado! O report é colocado em um banco de dados, e recebe uma identificação única que é repassada para o usuário.',
      timestamp: 1606334927649
    },
    '2,1': {
      v: '2,1',
      name: 'Motivo de reprovação',
      description: 'Foi adicionado um motivo para a reprovação de um report.',
      timestamp: 1608145712456
    }
  }
};

