const { admins } =  require('../../config/default.json');
const { static: { emoji } } = require('../../utils/emojis.json');
const client = require('../..');

module.exports = (msg) => {
  admins.forEach(async id => {
    const user = await client.users.fetch(id);
    
    user.send(msg)
      .catch(e => {
        console.warn(
          `Não foi possível entrar e contato com o usuário de ID: '${id}' que está cadastrado como um dos meus administradores!\n`+
          `Erro: "${JSON.stringify(e)}"\n`+
          `A mensagem que deveria ser enviada era: "${msg}"`
        );
        
        user.send(
          `> ${emoji.emojicoffeeinfo} Aviso!\n`+
          '> Há uma nova mensagem no console do bot!'
        ).catch(() => {});
      });
  });
};