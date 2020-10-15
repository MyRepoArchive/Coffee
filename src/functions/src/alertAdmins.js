const { owners } =  require('../../utils/info.json');
const { client } = require('../..');

module.exports = (msg) => {
  owners.forEach(async id => {
    const user = await client.users.fetch(id);
    
    try {
      user.send(msg);
    } catch (e) {
      console.warn(
        `Não foi possível entrar e contato com o usuário de ID: '${id}' que está cadastrado como um dos meus administradores!\n`+
        `A mensagem que deveria ser enviada era: "${msg}"`
      );
    };
  });
}