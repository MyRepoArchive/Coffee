const shell = require('shelljs');
const client = require('../../..');
const app = require('../../../..');
const chatOrDm = require('../../../functions/chatOrDm');
const { static: { emoji, eID } } = require('../../../utils/emojis.json');

module.exports = {
  config: require('./src/config'),

  run({ message, permissions }) {
    chatOrDm(`> ${emoji.emojicoffeeinfo} Aviso!\n` + 
    `> Você gostaria mesmo de restartar o bot? Se sim reaja com ${permissions.has('ADD_REACTIONS') ? emoji.emojicoffeecheck : '✅'}.`, permissions, message)
      .then(mess => {
        if (permissions.has('ADD_REACTIONS')) await mess.react(eID.emojicoffeecheck).catch(() => {});

        mess.createReactionCollector((reaction, user) => 
          (reaction.emoji.id === eID.emojicoffeecheck || reaction.emoji.name === '✅') && user.id === message.author.id, { time: 60000, max: 1 }
        ).on('collect', () => {
          client.destroy();
          app.close();
         
          shell.exec('node .');
        });
      }, () => {});
  }
};