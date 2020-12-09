module.exports = {
  name: "eval",
  aliases: ["ev", "e", "evaluate"],
  type: "Admin",
  description: 'Esse é um comando exclusivo para o uso de administradores do bot, sua função é: Executar o código JavaScript fornecido pelo usuário enquanto o bot está em execução, independente de qual seja. Por esse motivo, deve-se tomar cuidado ao utilizá-lo, pois pode acontecer de credenciais do bot serem vazadas sem que o autor queira.',
  how_to_use: 'Digite _eval no chat e passe como parâmetro o código javascript que deseja executar na instância do bot.',
  example: '_eval console.log("Hello, World!")',
  example_url: 'https://i.imgur.com/t1psaLe.png',
  cooldown: 60000,
  cooldownControl: {},
  times_limit: 1,
  active: true,
  reason_inactivity: null,
  created_timestamp: 1599083760000,
  updated_timestamp: 1607470153400,
  version: '2,1',
  releases_notes: {
    '1,0': {
      v: '1,0',
      name: 'Comando inicial',
      description: 'Verifica se quem executou o comando está cadastrado como administrador do bot, caso  seja, executa o valor em Javascript solicitado!',
      timestamp: 1599083760000
    },
    '1,1': {
      v: '1,1',
      name: 'Sistema para fechar o eval',
      description: 'Para cada eval aberto pelo bot, ele reage com um emoji que ao ser clicado por um admin, apaga a mensagem de resposta do bot!',
      timestamp: 1599511860000
    },
    '2,0': {
      v: '2,0',
      name: 'Code refactoring e melhorias',
      description: 'Agora o comando conta com duas novas funcionalidades para gestão do eval, uma delas é a de conseguir salvar o resultado do eval em em documento ".txt", que é enviado para a DM do usuário, e a segunda é poder enviar a mesma embed de resposta do bot para a DM do usuário. Essas novas funcionalidades podem ser utilizadas com reações no próprio eval (o bot já faz uma pré-reação para facilitar), ou com comandos pre-definidos: "!deval" para deletar o eval, "!sendeval" para enviar a embed do eval na DM do usuário, "!saveeval" para salvar o conteúdo do eval. O comando também verifica se na resposta do eval há alguma informação que seja uma credencial do bot (informações que ficam no arquivo "auth.json"), se houver, ele manda o eval na DM do usuário para evitar o vazamento de informações sem que o usuário deseje.',
      timestamp: 1606401503746
    },
    '2,1': {
      v: '2,1',
      name: 'Promises, typeof e objetos',
      description: 'É feita a prévia verificação do conteúdo do eval, se for uma Promise, ele aguarda a finalização da mesma para dar continuidade à execução do código, e já envia o valor de saída da Promise para o usuário. Adicionado também um novo campo na embed exibindo o tipo da saída do eval. Também faz uma verificação para saber se o valor do eval é um objeto, se for, passa por um método "stringify" para exibir corretamente os dados.',
      timestamp: 1607338598309
    }
  }
};

